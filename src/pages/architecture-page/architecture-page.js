import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { default as slugger } from "slug";
import * as matter from "gray-matter";
import dayjs from "dayjs";
import { useResetScroll } from "../../hooks/useResetScroll/use-reset-scroll";
import { useController } from "../../hooks/use-controller";
import siteConfig from "../../site-config.json";
import { useNav } from "../../hooks/use-nav";
import { useResolveMarkdown } from "../../hooks/use-resolve-markdown";
import { useQuery } from "../../hooks/use-query";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { useSearch } from "../../hooks/use-search";
import { TextPageTemplate } from "../../components/text-page-template";

export function ArchitecturePage() {
  const { application_id, slug } = useParams();
  const location = useLocation();
  let history = useHistory();
  const queryBranch = useQuery().get("branch");
  const [pageData, setPageData] = useState({
    loading: true,
    shouldRefreshContent: false,
    pageTitle: "",
    breadcrumbLinks: [],
    relatedArchitecture: [], // change
    branches: [],
    bodyContent: [],
  });
  const controller = useController();
  const navItems = useNav();
  const previewStatus = controller.getPreviewModeStatus();
  const workingBranchName = controller.getWorkingBranchName("application");
  const isMounted = useIsMounted();
  const onQueryChange = useSearch();

  useResetScroll(`${application_id}_${slug}`);

  const {
    resolveInbound,
    resolveOutbound,
    handleOnUploadImage,
    cleanupImages,
  } = useResolveMarkdown();

  const onSave = async (edits) => {
    console.log("edits", edits);

    try {
      for (const edit of edits) {
        const content = await resolveOutbound({
          markdown: edit.markdown,
          frontmatter: pageData.originalMarkdown[edit.id].data,
          markdownFileName: pageData.originalMarkdown[edit.id].id,
        });

        await controller.commitContent(
          "application",
          `${application_id}/architecture/${slug}/`, // change
          content
        );

        console.log("content", content);
      }

      setPageData((prevState) => ({
        ...prevState,
        shouldRefreshContent: true,
      }));
    } catch (error) {
      console.log(error);
    }

    console.log("done");
  };

  const handleOnCreatePage = async ({
    selectedPageType,
    title,
    reviewDate,
    userFacing,
  }) => {
    const slug = slugger(title);

    const frontmatter = {
      title,
      reviewDate,
      ...(userFacing !== undefined && { userFacing: userFacing }),
    };

    // Temporary workaround to see if a file exists (before creating one)
    // Look to move into method "doesRemotePageExist"?
    try {
      await controller.getFile(
        "application",
        `${application_id}/${selectedPageType}/${slug}/_index.md`
      );

      history.push(
        `/applications/${application_id}/${selectedPageType}/${slug}?branch=${workingBranchName}`
      );
    } catch (error) {
      // Only create page when 404 to prevent overwriting content when other errors are found
      if (error.status === 404) {
        const markdown = matter.stringify("", frontmatter);

        const listing = await controller.getListing("application", null);

        if (listing[application_id] === undefined) {
          listing[application_id] = {};
        }
        if (listing[application_id][selectedPageType] === undefined) {
          listing[application_id][selectedPageType] = {};
        }

        listing[application_id][selectedPageType][slug] = {
          "_index.md": {
            __meta: {
              ...frontmatter,
            },
          },
        };

        try {
          await controller.commitFile(
            "application",
            "listing.json",
            new Blob([JSON.stringify(listing)], { type: "text/plain" })
          );

          /*
          This will return 404 as file does not exist, wrapping in try catch will prevent us doing our redirect
          */
          await controller.commitFile(
            "application",
            `${application_id}/${selectedPageType}/${slug}/_index.md`,
            new Blob([markdown], { type: "text/plain" })
          );

          history.push(
            `/applications/${application_id}/${selectedPageType}/${slug}?branch=${workingBranchName}`
          );
        } catch (error) {
          console.log(error);
        }
      }
      //All other errors, do not allow creation of file, possibly throw error here
    }
  };

  const handleOnRequestToEditMetaData = async ({ title, reviewDate }) => {
    try {
      const frontmatter = {
        ...pageData.pageMetaData,
        title,
        reviewDate,
      };

      const listing = await controller.getListing("application", null);

      listing[application_id]["architecture"][slug] = {
        // change
        "_index.md": {
          __meta: {
            ...frontmatter,
          },
        },
      };

      await controller.commitFile(
        "application",
        "listing.json",
        new Blob([JSON.stringify(listing)], { type: "text/plain" })
      );

      const markdownString = matter.stringify(
        pageData.originalMarkdown["_index.md"].content,
        frontmatter
      );

      await controller.commitFile(
        "application",
        `${application_id}/architecture/${slug}/_index.md`, // change
        new Blob([markdownString], { type: "text/plain" })
      );

      setPageData((prevState) => ({
        ...prevState,
        shouldRefreshContent: true,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getPageData = async () => {
    if (queryBranch) {
      controller.setWorkingBranchName("application", queryBranch);
      await controller.setPreviewModeStatus(true);
      history.replace(location.pathname);
      return;
    }

    try {
      // Enable loading state
      setPageData((prevState) => ({ ...prevState, loading: true }));

      // Get original markdown
      let originalMarkdown = {};

      originalMarkdown["_index.md"] = {
        id: "_index.md",
        ...(await controller.getFile(
          "application",
          `${application_id}/architecture/${slug}/_index.md`
        )),
      };

      // Subsection markdown
      try {
        originalMarkdown["section-one.md"] = {
          id: "section-one.md",
          title: "Section One",
          ...(await controller.getFile(
            "application",
            `${application_id}/architecture/${slug}/section-one.md` // change
          )),
        };

        originalMarkdown["section-two.md"] = {
          id: "section-two.md",
          title: "Section Two",
          ...(await controller.getFile(
            "application",
            `${application_id}/architecture/${slug}/section-two.md` // change
          )),
        };
      } catch (error) {
        console.log(error);
      }

      console.log("originalMarkdown", originalMarkdown);

      // Resolve markdown
      const resolvedMarkdown = await Promise.all(
        Object.values(originalMarkdown).map(async (data, index) => {
          return {
            id: data.id,
            title: index > 0 ? data.title : null,
            defaultValue: await resolveInbound(
              data.content,
              `${application_id}/architecture/${slug}`,
              (path) => controller.getMedia("application", path)
            ),
          };
        })
      );

      console.log("resolvedMarkdown", resolvedMarkdown);

      // const mainSection = await controller.getFile(
      //   "application",
      //   `${application_id}/architecture/${slug}/_index.md` // change
      // );

      // const resolvedMarkdown = await resolveInbound(
      //   mainSection.content,
      //   `${application_id}/architecture/${slug}`, // change
      //   mediaFetcher
      // );

      // Process metadata / frontmatter

      const {
        title = "",
        reviewDate = dayjs().add(6, "month").toISOString(),
        ...legacyFrontMatter
      } = originalMarkdown["_index.md"].data;

      const pageMetaData = {
        title,
        reviewDate,
        ...legacyFrontMatter,
      };

      // Build breadcrumb data
      const { title: applicationTitle } = await controller.getListing(
        "application",
        `${application_id}/_index.md/__meta`
      );

      const breadcrumbLinks = [
        {
          label: "Home",
          url: "/",
        },
        {
          label: "Applications",
          url: `/applications`,
        },
        {
          label: applicationTitle,
          url: `/applications/${application_id}`,
        },
        {
          label: "Architecture", // change
          url: `/applications/${application_id}/architecture/${slug}`, // change
        },
      ];

      // Build related architecture data
      const relatedArchitectureData = await controller.getListing(
        "application",
        `${application_id}/architecture` // change
      );

      console.log(relatedArchitectureData);

      const relatedArchitecture = Object.keys(relatedArchitectureData) // change
        .sort()
        .reduce((links, property) => {
          if (
            relatedArchitectureData[property]?.["_index.md"] &&
            !isEmpty(relatedArchitectureData[property]["_index.md"]["__meta"])
          ) {
            links.push({
              label:
                relatedArchitectureData[property]["_index.md"]["__meta"].title,
              url: `/applications/${application_id}/architecture/${property}`,
            });
          }

          return links;
        }, []);

      console.log(relatedArchitecture);

      // Get branches
      const branches = await controller.getBranches("application");

      setPageData((prevState) => ({
        ...prevState,
        bodyContent: resolvedMarkdown,
        originalMarkdown,
        relatedArchitecture,
        pageTitle: originalMarkdown["_index.md"].data.title,
        pageMetaData,
        breadcrumbLinks,
        loading: false,
        branches,
      }));
    } catch (error) {
      if (error.status === 404) {
        controller.resetWorkingBranchName("application");
        controller.setPreviewModeStatus(false);

        history.push({
          pathname: "/not-found",
          state: { location },
        });
      } else {
        throw new Error(error);
      }
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    getPageData();

    return () => {
      cleanupImages();
    };
  }, [
    application_id,
    slug,
    previewStatus,
    workingBranchName,
    queryBranch,
    isMounted,
  ]);

  useEffect(() => {
    if (!pageData.shouldRefreshContent || !isMounted) return;

    getPageData();

    setPageData((prevState) => ({
      ...prevState,
      shouldRefreshContent: false,
    }));
  }, [pageData.shouldRefreshContent, isMounted]);

  return (
    <TextPageTemplate
      currentRoute={`/applications/${application_id}/architecture/${slug}`} // change
      pageTitle={pageData.pageTitle}
      siteTitle={siteConfig.siteTitle}
      version={siteConfig.version}
      logoSrc={siteConfig.theme.logoSrc}
      navItems={navItems}
      loading={pageData.loading}
      onQueryChange={onQueryChange}
      previewMode={controller.getPreviewModeStatus()}
      breadcrumbLinks={pageData.breadcrumbLinks}
      mainContentProps={{
        onUploadImage: handleOnUploadImage,
        content: pageData.bodyContent,
      }}
      asideContentProps={{
        menus: [
          {
            id: "aside-menu-related-architecture",
            initialCollapsed: true,
            menuTitle: "Related Architecture",
            menuItems: pageData.relatedArchitecture,
          },
        ],
        tableOfContents: true,
      }}
      previewModeControllerProps={{
        branches: pageData.branches,
        workingRepo: controller.getWorkingRepoName("application"),
        workingBranch: controller.getWorkingBranchName("application"),
        baseBranch: controller.getBaseBranchName("application"),
        onToggle: controller.togglePreviewModeStatus,
        onRequestToSwitchBranch: (branchName) => {
          controller.setWorkingBranchName("application", branchName);
        },
        onRequestToCreateBranch: (branchName) => {
          controller.createBranch("application", branchName);
        },
        onSave: async ({ edits }) => {
          await onSave(edits);
        },
        onRequestToCreatePullRequest: async (sourceBranch) => {
          return await controller.createPullRequest(
            "application",
            controller.getBaseBranchName("application"),
            sourceBranch
          );
        },
        pageCreatorProps: {
          onSubmit: handleOnCreatePage,
          pageTypes: [
            {
              name: "Architecture",
              value: "architecture",
              showUserFacing: false,
            },
            {
              name: "Design",
              value: "designs",
              showUserFacing: false,
            },
            {
              name: "Knowledge",
              value: "knowledge",
              showUserFacing: true,
            },
          ],
        },
        pageMetaEditorProps: {
          initialData: pageData.pageMetaData,
          onSubmit: handleOnRequestToEditMetaData,
        },
      }}
    />
  );
}
