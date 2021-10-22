import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { isEmpty } from "lodash-es";
import { default as slugger } from "slug";
import * as matter from "gray-matter";
import siteConfig from "../../site-config.json";
import { ApplicationsTemplate } from "../../components/applications-template";
import { useNav } from "../../hooks/use-nav";
import { useController } from "../../hooks/use-controller";
import { useResetScroll } from "../../hooks/useResetScroll/use-reset-scroll";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { useResolveMarkdown } from "../../hooks/use-resolve-markdown";
import { useApiService } from "../../hooks/use-api-service/use-api-service";
import { useQuery } from "../../hooks/use-query";

export function ApplicationsPage() {
  const [state, setState] = useState({
    loading: true,
    pageTitle: "",
    breadCrumbLinks: [],
    bodyContent: "",
    knowledgeLinks: [],
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
  const navItems = useNav();
  const controller = useController();
  const previewStatus = controller.getPreviewModeStatus();
  const workingBranchName = controller.getWorkingBranchName("application");
  const isMounted = useIsMounted();
  const apiService = useApiService();

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

  const handleOnSave = async ({ markdown, images, commitMessage }) => {
    try {
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
    } catch (error) {
      console.error(error);
    }
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

  const handleOnCreatePage = async ({ title, reviewDate, userFacing }) => {
    const slug = slugger(title);

    const frontmatter = {
      title,
      reviewDate,
      userFacing,
    };

    // Temporary workaround to see if a file exists (before creating one)
    // Look to move into method "doesRemotePageExist"?
    try {
      await controller.getFile(
        "application",
        `${application_id}/knowledge/${slug}/_index.md`
      );

      history.push(
        `/applications/${application_id}/knowledge/${slug}?branch=${workingBranchName}`
      );
    } catch (error) {
      // Only create page when 404 to prevent overwriting content when other errors are found
      if (error.status === 404) {
        const markdown = matter.stringify("", frontmatter);

        const listing = await controller.getListing("application", null);

        listing[application_id]["knowledge"][slug] = {
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
            `${application_id}/knowledge/${slug}/_index.md`,
            new Blob([markdown], { type: "text/plain" })
          );

          history.push(
            `/applications/${application_id}/knowledge/${slug}?branch=${workingBranchName}`
          );
        } catch (error) {}
      }
      //All other errors, do not allow creation of file, possibly throw error here
    }
  };

  const mapApplicationDataToSchema = (applications) => {
    if (!applications) return null;

    return applications.map((data) => ({
      id: data.id,
      controlType: data.controlType,
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
        systemSource: data.systemSource,
        systemStage: data.systemStage,
      },
    }));
  };

  useEffect(() => {
    (async () => {
      if (queryBranch) {
        controller.setWorkingBranchName("application", queryBranch);
        await controller.setPreviewModeStatus(true);
      }
    })();
  }, [queryBranch]);

  useEffect(() => {
    if (!isMounted) return;

    const getPageData = async () => {
      if (queryBranch) {
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

        // Build breadcrumb data
        const breadcrumbLinks = [
          {
            label: "Home",
            url: "/",
          },
          {
            label: "Applications",
            url: `/applications`,
          },
        ];

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

        const applicationTypes = JSON.parse(
          await (await apiService("/api/application-types/")).data.text()
        );

        const environments = JSON.parse(
          await (await apiService("/api/environments/")).data.text()
        );

        setState((prevState) => ({
          ...prevState,
          applicationId: application.id,
          branches: branches,
          pageTitle: application.name,
          breadcrumbLinks: breadcrumbLinks,
          bodyContent: bodyContent,
          frontmatter: markdownResponse?.data,
          loading: false,
          knowledgeLinks,
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
    <ApplicationsTemplate
      currentRoute={`/applications/${application_id}`}
      siteTitle={siteConfig.siteTitle}
      pageTitle={state.pageTitle}
      version={siteConfig.version}
      logoSrc={siteConfig.theme.logoSrc}
      navItems={navItems}
      breadcrumbLinks={state.breadcrumbLinks}
      bodyContent={state.bodyContent}
      knowledgeLinks={state.knowledgeLinks}
      complianceTableTitle={state.complianceTableTitle}
      complianceTableApplications={state.complianceTableApplications}
      complianceTableOnAcceptOfRisk={handleOnComplianceAcceptOfRisk}
      complianceTableNoDataMessage={complianceTableNoDataMessage}
      complianceTableInvalidPermissionsMessage={
        complianceTableInvalidPermissionsMessage
      }
      workingRepo={controller.getWorkingRepoName("application")}
      workingBranch={controller.getWorkingBranchName("application")}
      branches={state.branches}
      onRequestToSwitchBranch={(branchName) =>
        controller.setWorkingBranchName("application", branchName)
      }
      onRequestToCreateBranch={(branchName) =>
        controller.createBranch("application", branchName)
      }
      onSave={handleOnSave}
      applications={state.applications}
      applicationTypes={state.applicationTypes}
      environments={state.environments}
      referenceTypes={state.referenceTypes}
      onRequestToCreateApplication={handleOnRequestToCreateApplication}
      previewMode={controller.getPreviewModeStatus()}
      loading={state.loading}
      onTogglePreviewMode={controller.togglePreviewModeStatus}
      onRequestToUploadImage={handleOnUploadImage}
      onRequestToCreatePage={handleOnCreatePage}
      controlOverviewTitle="Control Overview"
      controlOverviewData={{
        groups: [],
        controls: undefined,
        resources: undefined,
      }}
      onRequestOfControlsData={() => {}}
      onRequestOfResourcesData={() => {}}
      onResourceExemptionDelete={() => {}}
      onResourceExemptionSave={() => {}}
    />
  );
}
