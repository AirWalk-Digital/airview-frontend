import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AccordionMenu } from "../../components/accordion-menu";
import { Menu } from "../../components/menu";
import { ComplianceTable } from "../../components/compliance-table";
import { PreviewModeController } from "../../components/preview-mode-controller";
import {
  BranchSwitcher,
  BranchCreator,
  PageCreator,
  ContentCommitter,
  ApplicationCreator,
} from "../../components/preview-mode-controller";
import { ApplicationsTemplate } from "../../components/applications-template";
import { useControlOverviewController } from "../../components/control-overview/use-control-overview-controller";
import {
  data,
  messages,
  useComplianceTableDemoController,
} from "../compliance-table/compliance-table-demo-controller";
import markdownContent from "../__resources/markdown-content.md";
import logo from "../__resources/logo-airwalk-reply.svg";

const config = {
  title: "Templates/Applications Template",
  component: ApplicationsTemplate,
  parameters: {
    layout: "fullscreen",
    subcomponents: {
      AccordionMenu,
      Menu,
      ComplianceTable,
      PreviewModeController,
      BranchSwitcher,
      BranchCreator,
      PageCreator,
      ContentCommitter,
      ApplicationCreator,
    },
  },
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        "@global": {
          "#docs-root .MuiAppBar-root": {
            position: "initial",
          },
        },
        root: {},
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

const Template = (args) => {
  const [
    state,
    setControlsData,
    setResourcesData,
  ] = useControlOverviewController(async () => {
    try {
      const response = await fetch(`https://testapi.dev/quality-models`);

      if (response.ok) {
        return await response.json();
      }

      throw new Error();
    } catch (error) {
      return "error";
    }
  });

  const handleOnRequestOfControlsData = (id) => {
    setControlsData(id, async () => {
      try {
        const response = await fetch(
          `https://testapi.dev/applications/1/control-overviews?qualityModelId=${id}`
        );

        if (response.ok) {
          return await response.json();
        }

        throw new Error();
      } catch (error) {
        return "error";
      }
    });
  };

  const handleOnRequestOfResourcesData = (id) => {
    setResourcesData(id, async () => {
      try {
        const response = await fetch(
          `https://testapi.dev/applications/1/monitored-resources?technicalControlId=${id}`
        );

        if (response.ok) {
          return await response.json();
        }

        throw new Error();
      } catch (error) {
        return "error";
      }
    });
  };

  const handleOnResourceExemptionDelete = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve();
      }, [1000]);
    });
  };

  const handleOnResourceExemptionSave = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve();
      }, [1000]);
    });
  };

  const {
    applicationData,
    handleOnAcceptOfRisk,
  } = useComplianceTableDemoController([...data]);

  return (
    <ApplicationsTemplate
      {...args}
      controlOverviewTitle="Control Overview"
      controlOverviewData={state}
      onRequestOfControlsData={handleOnRequestOfControlsData}
      onRequestOfResourcesData={handleOnRequestOfResourcesData}
      onResourceExemptionDelete={handleOnResourceExemptionDelete}
      onResourceExemptionSave={handleOnResourceExemptionSave}
      complianceTableTitle="Compliance Table"
      complianceTableApplications={applicationData}
      complianceTableOnAcceptOfRisk={handleOnAcceptOfRisk}
      complianceTableNoDataMessage={messages.noDataMessage}
      complianceTableInvalidPermissionsMessage={
        messages.invalidPermissionsMessage
      }
    />
  );
};

Template.args = {
  currentRoute: "/applications/application-template",
  siteTitle: "AirView",
  pageTitle: "Application Template",
  version: "1.0",
  logoSrc: logo,
  navItems: [
    {
      id: "1",
      name: "Applications",
      children: [
        {
          id: "2",
          name: "Application Template",
          url: "/applications/application-template",
        },
      ],
    },
  ],
  breadcrumbLinks: [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Applications",
      url: "/applications",
    },
  ],
  bodyContent: markdownContent,
  knowledgeLinks: [
    {
      label: "Knowledge Item",
      url: "/knowledge/some-knowledge/knowledge-item",
    },
  ],
  workingRepo: "test-org/test-repo",
  workingBranch: "master",
  branches: [
    {
      name: "master",
      protected: true,
    },
    {
      name: "development",
      protected: false,
    },
  ],
  onRequestToSwitchBranch: () => {},
  onRequestToCreateBranch: () => {},
  onRequestToCreatePage: () => {},
  onSave: async (data) => {
    console.log(data);
  },
  applications: [
    {
      name: "Application One",
      id: 1,
    },
    {
      name: "Application Two",
      id: 2,
    },
  ],
  applicationTypes: [
    {
      name: "Type One",
      id: 1,
    },
    {
      name: "Type Two",
      id: 2,
    },
  ],
  environments: [
    {
      name: "Environment One",
      id: 1,
    },
    {
      name: "Environment Two",
      id: 2,
    },
  ],
  referenceTypes: ["type_one", "type_two"],
  onRequestToCreateApplication: (data) => {
    console.log(data);
  },
  previewMode: false,
  loading: false,
};

const PreviewDisabled = Template.bind({});

PreviewDisabled.args = {
  ...Template.args,
};

const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
  loading: true,
};

const PreviewEnabled = Template.bind({});

PreviewEnabled.args = {
  ...Template.args,
  previewMode: true,
};

export { PreviewDisabled, Loading, PreviewEnabled };

export default config;
