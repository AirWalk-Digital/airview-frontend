import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";
import * as PageHeaderStories from "../page-header/page-header.stories";
import { makeStyles } from "@material-ui/core/styles";
import { HomepageTemplate } from "../../components/homepage-template/";

export default {
  title: "Templates/Homepage Template",
  component: HomepageTemplate,
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
  argTypes: {
    previewMode: {
      table: {
        disable: true,
      },
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
  return <HomepageTemplate {...args} />;
}

Template.args = {
  currentRoute: "/",
  pageTitle: "Application Template",
  loading: false,
};

export const Loading = {
  ...Template,
  args: {
    ...Template.args,
    ...PageHeaderStories.Loading.args,
  },
};

export const Loaded = {
  ...Template,
  args: {
    ...Template.args,
    ...PageHeaderStories.PreviewDisabled.args,
  },
};
