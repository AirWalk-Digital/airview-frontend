import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import { AccordionMenu } from "../../components/accordion-menu";
import { Menu } from "../../components/menu";
import { PreviewModeController } from "../../components/preview-mode-controller";
import {
  BranchSwitcher,
  BranchCreator,
  PageCreator,
} from "../../components/preview-mode-controller";
import { KnowledgeTemplate } from "../../components/knowledge-template";
import markdownContent from "../__resources/markdown-content.md";

const config = {
  title: "Templates/Knowledge Template",
  component: KnowledgeTemplate,
  parameters: {
    layout: "fullscreen",
    subcomponents: {
      AccordionMenu,
      Menu,
      PreviewModeController,
      BranchSwitcher,
      BranchCreator,
      PageCreator,
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
  return <KnowledgeTemplate {...args} />;
};

Template.args = {
  currentRoute: "/knowledge/knowledge-template",
  siteTitle: "AirView",
  pageTitle: "Knowledge Template",
  version: "1.0",
  logoSrc: "/logo-airwalk-reply.svg",
  navItems: [
    {
      id: "1",
      name: "Knowledge",
      children: [
        {
          id: "2",
          name: "Knowledge Template",
          url: "/knowledge/knowledge-template",
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
    {
      label: "Application Item",
      url: "/applications/application-item",
    },
    {
      label: "Knowledge",
      url: "/applications/application-item/knowledge",
    },
  ],
  relatedKnowledge: [
    {
      label: "Knowlege Item",
      url: "/",
    },
  ],
  bodyContent: markdownContent,
  workingRepo: "test-org/test-repo",
  workingBranch: "master",
  branches: [
    {
      name: "master",
      protected: true,
    },
  ],
  onRequestToSwitchBranch: () => {},
  onRequestToCreateBranch: () => {},
  onRequestToCreatePage: (data) => {
    console.log(data);
  },
  onRequestToEditPageMetaData: (data) => {
    console.log(data);
  },
  onSave: async (data) => {
    console.log(data);
  },
  loading: false,
  previewMode: false,
  pageMetaData: {
    documentName: "Knowledge Template",
    reviewDate: dayjs().add(1, "month").toISOString(),
    userFacingDocument: true,
  },
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
