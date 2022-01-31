import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";
import { makeStyles } from "@material-ui/core/styles";
import * as PageHeaderStories from "../page-header/page-header.stories";
import * as BreadcrumbStories from "../breadcrumb/breadcrumb.stories";
import { LayoutBase } from "../../components/layout-base";

export default {
  title: "Layouts/Layout Base",
  component: LayoutBase,
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
  return <LayoutBase {...args} />;
}

Template.args = {
  currentRoute: "/",
  pageTitle: "Page Title",
};

export const Loading = {
  ...Template,
  args: {
    ...Template.args,
    ...PageHeaderStories.Loading.args,
    breadcrumbLinks: [],
  },
};

export const LoadedPreviewDisabled = {
  ...Template.args,
  args: {
    ...Template.args,
    ...PageHeaderStories.PreviewDisabled.args,
    breadcrumbLinks:
      BreadcrumbStories.LoadedWithoutCollapsedBreadcrumbs.args.links,
  },
};

export const LoadedPreviewEnabled = {
  ...Template.args,
  args: {
    ...Template.args,
    ...PageHeaderStories.PreviewEnabled.args,
    breadcrumbLinks:
      BreadcrumbStories.LoadedWithoutCollapsedBreadcrumbs.args.links,
  },
};
