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

export function DesignPage() {
  const { application_id, slug } = useParams();
  const location = useLocation();
  let history = useHistory();
  const queryBranch = useQuery().get("branch");
  const [pageData, setPageData] = useState({
    loading: true,
    shouldRefreshContent: false,
    pageTitle: "",
    breadcrumbLinks: [],
    relatedDesign: [], // change
    branches: [],
  });
  const controller = useController();
  const previewStatus = controller.getPreviewModeStatus();
  const navItems = useNav(previewStatus);
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

  const onSave = async (markdownData, frontmatter) => {
    try {
      const content = await resolveOutbound({
        markdown: markdownData,
        frontmatter,
        markdownFileName: "_index.md",
      });

      await controller.commitContent(
        "application",
        `${application_id}/designs/${slug}/`, // change
        content
      );

      setPageData((prevState) => ({
        ...prevState,
        shouldRefreshContent: true,
      }));
    } catch (error) {
      console.error(error);
    }
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

      listing[application_id]["designs"][slug] = {
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
        pageData.orignalMarkdown,
        frontmatter
      );

      await controller.commitFile(
        "application",
        `${application_id}/designs/${slug}/_index.md`, // change
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

      // Fetch and resolve markdown content / images
      const mediaFetcher = (path) => controller.getMedia("application", path);

      const response = await controller.getFile(
        "application",
        `${application_id}/designs/${slug}/_index.md` // change
      );

      const resolvedMarkdown = await resolveInbound(
        response.content,
        `${application_id}/designs/${slug}`, // change
        mediaFetcher
      );

      const {
        title = "",
        reviewDate = dayjs().add(6, "month").toISOString(),
        //userFacing = false,
        ...legacyFrontMatter
      } = response.data;

      const pageMetaData = {
        title,
        reviewDate,
        //userFacing,
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
          label: "Designs", // change
          url: `/applications/${application_id}/designs/${slug}`, // change
        },
      ];

      // Build related designs data
      const relatedDesignsData = await controller.getListing(
        "application",
        `${application_id}/designs` // change
      );

      const relatedDesigns = Object.keys(relatedDesignsData) // change
        .sort()
        .reduce((links, property) => {
          if (
            relatedDesignsData[property]?.["_index.md"] &&
            !isEmpty(relatedDesignsData[property]["_index.md"]["__meta"])
          ) {
            links.push({
              label: relatedDesignsData[property]["_index.md"]["__meta"].title,
              url: `/applications/${application_id}/designs/${property}`,
            });
          }

          return links;
        }, []);

      // Get branches
      const branches = await controller.getBranches("application");

      setPageData((prevState) => ({
        ...prevState,
        bodyContent: resolvedMarkdown,
        orignalMarkdown: response.content,
        relatedDesigns,
        pageTitle: response.data.title,
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
      currentRoute={`/applications/${application_id}/designs/${slug}`} // change
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
        content: [
          {
            id: "_index.md",
            defaultValue: pageData.bodyContent,
          },
        ],
      }}
      asideContentProps={{
        menus: [
          {
            id: "aside-menu-related-designs",
            initialCollapsed: true,
            menuTitle: "Related Designs",
            menuItems: pageData.relatedDesigns,
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
        onSave: async (markdownData) => {
          await onSave(markdownData.edits[0].markdown, pageData.pageMetaData);
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
              name: "Design",
              value: "designs",
              showUserFacing: false,
            },
            {
              name: "Knowledge",
              value: "knowledge",
              showUserFacing: true,
            },
            {
              name: "Architecture",
              value: "architecture",
              showUserFacing: false,
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
