import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";
import * as PageHeaderStories from "../page-header/page-header.stories";
import { makeStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import { KnowledgeTemplate } from "../../components/knowledge-template";
import markdownContent from "../__resources/markdown-content.md";

const config = {
  title: "Templates/Knowledge Template",
  component: KnowledgeTemplate,
  parameters: {
    layout: "fullscreen",
    docs: {
      page: () => (
        <>
          <Title />
          <ArgsTable />
        </>
      ),
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
  pageTitle: "Knowledge Template",
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
  workingBranch: "development",
  baseBranch: "master",
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
  //onRequestToSwitchBranch: () => {},
  //onRequestToCreateBranch: () => {},
  // onRequestToCreatePage: (data) => {
  //   console.log(data);
  // },
  // onRequestToEditPageMetaData: (data) => {
  //   console.log(data);
  // },
  // onSave: async (data) => {
  //   console.log(data);
  // },
  // onRequestToCreatePullRequest: (from, to) => {
  //   console.log(`PR request from branch "${from}" to branch "${to}"`);

  //   return "https://github.com";
  // },
  loading: false,
  previewMode: false,
  pageMetaData: {
    title: "Knowledge Template",
    reviewDate: dayjs().add(1, "month").toISOString(),
    userFacing: true,
  },
};

const PreviewDisabled = Template.bind({});

PreviewDisabled.args = {
  ...PageHeaderStories.PreviewDisabled.args,
  ...Template.args,
  loading: false,
  previewMode: false,
};

const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
  ...PageHeaderStories.Loading.args,
};

const PreviewEnabled = Template.bind({});

PreviewEnabled.args = {
  ...Template.args,
  ...PageHeaderStories.PreviewEnabled.args,
};

export { PreviewDisabled, Loading, PreviewEnabled };

export default config;
