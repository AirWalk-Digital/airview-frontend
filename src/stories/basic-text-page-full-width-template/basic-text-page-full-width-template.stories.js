import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";
import { makeStyles } from "@material-ui/core/styles";
import * as PageHeaderStories from "../page-header/page-header.stories";
import { BasicTextPageFullWidthTemplate } from "../../components/basic-text-page-full-width-template";
import exampleMarkdownContent from "./example-markdown-content.md";

const config = {
  title: "Templates/Basic Text Page Full Width Template",
  component: BasicTextPageFullWidthTemplate,
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

function Template(args) {
  return <BasicTextPageFullWidthTemplate {...args} />;
}

Template.args = {
  currentRoute: "/basic-text-page",
  pageTitle: "Basic Text Page",
  breadcrumbLinks: [
    {
      label: "Home",
      url: "/",
    },
  ],
  bodyContent: exampleMarkdownContent,
};

Template.argTypes = {
  previewMode: {
    table: {
      disable: true,
    },
  },
};

const Loaded = Template.bind({});
Loaded.args = {
  ...Template.args,
  ...PageHeaderStories.PreviewDisabled.args,
};

Loaded.argTypes = {
  ...Template.argTypes,
};

const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
  ...PageHeaderStories.Loading.args,
};

Loading.argTypes = {
  ...Template.argTypes,
};

export { Loaded, Loading };

export default config;
