import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { default as slugger } from "slug";
import * as matter from "gray-matter";
import siteConfig from "../../site-config.json";
import { TextPageTemplate } from "../../components/text-page-template";
import { useNav } from "../../hooks/use-nav";
import { useController } from "../../hooks/use-controller";
import { useResetScroll } from "../../hooks/useResetScroll/use-reset-scroll";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { useResolveMarkdown } from "../../hooks/use-resolve-markdown";
import { useApiService } from "../../hooks/use-api-service/use-api-service";
import { useQuery } from "../../hooks/use-query";
import { useControlOverviewController } from "../../components/control-overview/use-control-overview-controller";
import { useSearch } from "../../hooks/use-search";
import { ComplianceTable } from "../../components/compliance-table";
import { ControlOverview } from "../../components/control-overview";

/*
To do:
- Fetch designs pages data for aside menu
- Fetch Architecture pages data for aside menu
- Need a create designs button added to applications
- need a create architecture button added to applications
*/

export function ApplicationsPage() {
  const [state, setState] = useState({
    loading: true,
    pageTitle: "",
    bodyContent: "",
    knowledgeLinks: [],
    designsLinks: [],
    architectureLinks: [],
    complianceTableApplications: [],
    branches: [],
    applications: [],
    applicationTypes: [],
    environments: [],
    referenceTypes: [],
  });
  const { application_id } = useParams();
  const location = useLocation();
  let history = useHistory();
  const queryBranch = useQuery().get("branch");
  const controller = useController();
  const previewStatus = controller.getPreviewModeStatus();
  const navItems = useNav(previewStatus);
  const workingBranchName = controller.getWorkingBranchName("application");
  const isMounted = useIsMounted();
  const apiService = useApiService();
  const onQueryChange = useSearch();

  const complianceTableNoDataMessage = {
    title: "No issues",
    message: "There are no issues to display for this application",
  };

  const complianceTableInvalidPermissionsMessage = {
    title: "Notice",
    message:
      "You do not have the required permissions to view the data for this application",
  };

  useResetScroll(`${application_id}`);

  const {
    resolveInbound,
    resolveOutbound,
    handleOnUploadImage,
    cleanupImages,
  } = useResolveMarkdown();

  const handleOnComplianceAcceptOfRisk = async (formData) => {
    const riskToString = (s) => {
      switch (s.toLowerCase()) {
        case "low":
          return 1;
        case "medium":
          return 2;
        case "moderate":
          return 2;
        case "high":
          return 3;
        case "absolute":
          return 4;
        default:
          throw new Error("Unable to map risk value to string");
      }
    };

    const postData = {
      applicationTechnicalControlId: formData.applicationId.value,
      summary: formData.summary.value,
      mitigation: formData.mitigation.value,
      probability: riskToString(formData.probability.value),
      impact: riskToString(formData.impact.value),
      resources: formData.resources.value,
      isLimitedExclusion: formData.limitedExemption.value,
      endDate: formData.exemptionEnd.value.toJSON(),
      notes: formData.notes.value,
    };

    try {
      await apiService("/api/exclusions/", "post", postData);

      const applicationComplianceData = JSON.parse(
        await (
          await apiService(
            `/api/applications/${state.applicationId}/control-statuses`
          )
        ).data.text()
      );

      setState((prevState) => ({
        ...prevState,
        complianceTableApplications: mapApplicationDataToSchema(
          applicationComplianceData
        ),
      }));
    } catch (error) {
      throw new Error(error);
    }
  };

  const onSave = async (markdown) => {
    const content = await resolveOutbound({
      markdown: markdown,
      frontmatter: state.frontmatter,
      markdownFileName: "_index.md",
    });

    await controller.commitContent(
      "application",
      `${application_id}/`,
      content
    );
  };
  const [
    controlOverviewState,
    setControlsData,
    setResourcesData,
  ] = useControlOverviewController(async () => {
    if (state.applicationId == undefined) {
      return [];
    }
    const models = JSON.parse(
      await (
        await apiService(
          `/api/applications/${state.applicationId}/quality-models`
        )
      ).data.text()
    );
    return models.map((item, index) => {
      return {
        id: index,
        title:
          item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
      };
    });
  }, state.applicationId);

  const handleOnRequestOfControlsData = (id) => {
    setControlsData(id, async () => {
      const controls = JSON.parse(
        await (
          await apiService(
            `/api/applications/${state.applicationId}/control-overviews?qualityModel=SECURITY`
          )
        ).data.text()
      );

      return controls.map((item) => {
        return {
          ...item,
          severity:
            item.severity.charAt(0).toUpperCase() +
            item.severity.slice(1).toLowerCase(),

          control: { name: item.name, url: "/" },
          frameworks: [],
          controlAction:
            item.controlAction.charAt(0).toUpperCase() +
            item.controlAction.slice(1).toLowerCase(),
          lifecycle: item.systemStage,
        };
      });
    });
  };

  const handleOnRequestOfResourcesData = (id) => {
    setResourcesData(id, async () => {
      const resources = JSON.parse(
        await (
          await apiService(
            `/api/applications/${state.applicationId}/monitored-resources?technicalControlId=${id}`
          )
        ).data.text()
      );
      return resources.map((item) => {
        const status =
          item.state === "FLAGGED" ? "Non-Compliant" : "Monitoring";
        return { ...item, type: "Unknown", status: status };
      });
    });
  };

  const handleOnRequestToCreateApplication = async (formData) => {
    try {
      const response = await apiService("/api/applications/", "POST", formData);
      const responseData = await JSON.parse(await response.data.text());
      const redirectSlug = responseData.references.filter(
        (reference) => reference.type === "_internal_reference"
      )[0].reference;

      await controller.setPreviewModeStatus(false);
      controller.resetWorkingBranchName("application");
      history.push(`/applications/${redirectSlug}`);
    } catch (error) {
      throw new Error("Unable to create application");
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

  const mapApplicationDataToSchema = (applications) => {
    if (!applications) return null;

    return applications.map((data) => ({
      id: data.id,
      qualityModel: data.qualityModel.toLowerCase(),
      severity: data.severity,
      name: data.name,
      environment: data.environment,
      raisedDateTime: data.raisedDateTime,
      tickets: data.tickets.map((ticket) => ({
        reference: ticket.reference,
        type: ticket.type,
      })),
      applicationDetailData: {
        instances: data.resources.map(({ id, name, state }) => ({
          id,
          name,
          status: state.toLowerCase(),
        })),
        control: {
          name: data.name,
          url: "",
        },
        frameworks: [],
        environment: data.environment,
        assignmentGroup: "-",
        assignee: "-",
        systemSource: data.systemName,
        systemStage: data.systemStage,
      },
    }));
  };

  useEffect(() => {
    if (!isMounted) return;

    const getPageData = async () => {
      if (queryBranch) {
        controller.setWorkingBranchName("application", queryBranch);
        await controller.setPreviewModeStatus(true);
        history.replace(location.pathname);
        return;
      }

      try {
        // Enable loading state
        setState((prevState) => ({ ...prevState, loading: true }));

        // Check we have a valid application, will throw if not found > redirect to 404 page
        const application = JSON.parse(
          await (
            await apiService(
              `/api/referenced-applications/?type=_internal_reference&reference=${application_id}`
            )
          ).data.text()
        );

        let markdownResponse;
        let bodyContent;

        // Fetch and resolve markdown content / images
        try {
          markdownResponse = await controller.getFile(
            "application",
            `${application_id}/_index.md`
          );

          bodyContent = await resolveInbound(
            markdownResponse.content,
            `${application_id}`,
            (path) => controller.getMedia("application", path)
          );
        } catch (error) {
          if (error.status === 404) {
            bodyContent = "";
          } else {
            throw new Error(error);
          }
        }

        // Build knowledge links
        const knowledgeData = await controller.getListing(
          "application",
          `${application_id}/knowledge`
        );

        const knowledgeLinks = Object.keys(knowledgeData)
          .sort()
          .reduce((links, property) => {
            if (
              knowledgeData[property]?.["_index.md"] &&
              !isEmpty(knowledgeData[property]["_index.md"]["__meta"])
            ) {
              links.push({
                label: knowledgeData[property]["_index.md"]["__meta"].title,
                url: `/applications/${application_id}/knowledge/${property}`,
              });
            }

            return links;
          }, []);

        // Build designs links
        const designsData = await controller.getListing(
          "application",
          `${application_id}/designs`
        );

        const designsLinks = Object.keys(designsData)
          .sort()
          .reduce((links, property) => {
            if (
              designsData[property]?.["_index.md"] &&
              !isEmpty(designsData[property]["_index.md"]["__meta"])
            ) {
              links.push({
                label: designsData[property]["_index.md"]["__meta"].title,
                url: `/applications/${application_id}/designs/${property}`,
              });
            }

            return links;
          }, []);

        // Build architecture links
        const architectureData = await controller.getListing(
          "application",
          `${application_id}/architecture`
        );

        const architectureLinks = Object.keys(architectureData)
          .sort()
          .reduce((links, property) => {
            if (
              architectureData[property]?.["_index.md"] &&
              !isEmpty(architectureData[property]["_index.md"]["__meta"])
            ) {
              links.push({
                label: architectureData[property]["_index.md"]["__meta"].title,
                url: `/applications/${application_id}/architecture/${property}`,
              });
            }

            return links;
          }, []);

        // Get compliance table data
        let applicationComplianceData;

        try {
          applicationComplianceData = JSON.parse(
            await (
              await apiService(
                `/api/applications/${application.id}/control-statuses`
              )
            ).data.text()
          );
        } catch (error) {
          if (error.status !== 403) throw error;
        }

        // Get branches
        const branches = await controller.getBranches("application");

        // Get data for application creator
        const applicationsData = JSON.parse(
          await (await apiService("/api/applications/")).data.text()
        );

        const applications = applicationsData.filter(
          (application) => !application.parentId
        );

        const applicationTypes = [
          { id: "BUSINESS_APPLICATION", name: "Business Application" },
          { id: "APPLICATION_SERVICE", name: "Application Service" },
          { id: "TECHINCAL_SERVICE", name: "Technical Service" },
        ];

        const environments = JSON.parse(
          await (await apiService("/api/environments/")).data.text()
        );

        setState((prevState) => ({
          ...prevState,
          applicationId: application.id,
          branches: branches,
          pageTitle: application.name,
          //breadcrumbLinks: breadcrumbLinks,
          bodyContent: bodyContent,
          frontmatter: markdownResponse?.data,
          loading: false,
          knowledgeLinks,
          designsLinks,
          architectureLinks,
          complianceTableTitle: "Compliance Data",
          complianceTableApplications: mapApplicationDataToSchema(
            applicationComplianceData
          ),
          applications,
          applicationTypes,
          environments,
          referenceTypes: ["aws_account_id", "azure_subscription_id"],
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

    getPageData();

    return () => {
      cleanupImages();
    };
  }, [
    application_id,
    previewStatus,
    workingBranchName,
    queryBranch,
    isMounted,
  ]);

  return (
    <TextPageTemplate
      currentRoute={`/applications/${application_id}`}
      pageTitle={state.pageTitle}
      siteTitle={siteConfig.siteTitle}
      version={siteConfig.version}
      logoSrc={siteConfig.theme.logoSrc}
      navItems={navItems}
      loading={state.loading}
      onQueryChange={onQueryChange}
      previewMode={controller.getPreviewModeStatus()}
      breadcrumbLinks={[
        {
          label: "Home",
          url: "/",
        },
        {
          label: "Applications",
          url: `/applications`,
        },
      ]}
      mainContentProps={{
        onUploadImage: handleOnUploadImage,
        content: [
          {
            id: "_index.md",
            defaultValue: state.bodyContent,
            additionalContent: (
              <>
                <ComplianceTable
                  title={state.complianceTableTitle}
                  applications={state.complianceTableApplications}
                  invalidPermissionsMessage={
                    complianceTableInvalidPermissionsMessage
                  }
                  loading={state.loading}
                  noDataMessage={complianceTableNoDataMessage}
                  onAcceptOfRisk={handleOnComplianceAcceptOfRisk}
                />
                <ControlOverview
                  loading={state.loading}
                  title="Control Overview"
                  data={controlOverviewState}
                  onRequestOfControlsData={handleOnRequestOfControlsData}
                  onRequestOfResourcesData={handleOnRequestOfResourcesData}
                  onResourceExemptionDelete={() => {}}
                  onResourceExemptionSave={() => {}}
                />
              </>
            ),
          },
        ],
      }}
      asideContentProps={{
        menus: [
          {
            id: "aside-menu-knowledge",
            initialCollapsed: true,
            menuTitle: "Knowledge",
            menuItems: state.knowledgeLinks,
          },
          {
            id: "aside-menu-designs",
            initialCollapsed: true,
            menuTitle: "Designs",
            menuItems: state.designsLinks,
          },
          {
            id: "aside-menu-architecture",
            initialCollapsed: true,
            menuTitle: "Architecture",
            menuItems: state.architectureLinks,
          },
        ].filter((f) => f.menuItems.length > 0),
        tableOfContents: true,
      }}
      previewModeControllerProps={{
        branches: state.branches,
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
          await onSave(markdownData.edits[0].markdown);
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
              name: "Knowledge",
              value: "knowledge",
              showUserFacing: true,
            },
            {
              name: "Design",
              value: "designs",
              showUserFacing: false,
            },
            {
              name: "Architecture",
              value: "architecture",
              showUserFacing: false,
            },
          ],
        },
        applicationCreatorProps: {
          applications: state.applications,
          applicationTypes: state.applicationTypes,
          environments: state.environments,
          referenceTypes: state.referenceTypes,
          onSubmit: handleOnRequestToCreateApplication,
        },
      }}
    />
  );
}
