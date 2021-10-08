import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BasicTextPageFullWidthTemplate } from "../../components/basic-text-page-full-width-template";
import exampleMarkdownContent from "./example-markdown-content.md";

const config = {
  title: "Templates/Basic Text Page Full Width Template",
  component: BasicTextPageFullWidthTemplate,
  parameters: {
    layout: "fullscreen",
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
  siteTitle: "AirView",
  version: "1.0",
  logoSrc: "/logo-airwalk-reply.svg",
  navItems: [
    {
      id: "1",
      name: "Home",
      url: "/",
    },
    {
      id: "2",
      name: "Applications",
      children: [
        {
          id: "3",
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
  ],
  bodyContent: exampleMarkdownContent,
  loading: false,
};

const Default = Template.bind({});
Default.args = {
  ...Template.args,
};

const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
  navItems: null,
  loading: true,
};

export { Default, Loading };

export default config;
