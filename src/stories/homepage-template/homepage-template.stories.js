import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";
import * as PageHeaderStories from "../page-header/page-header.stories";
import { makeStyles } from "@material-ui/core/styles";
import { HomepageTemplate } from "../../components/homepage-template/";

const config = {
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
  ...PageHeaderStories.Default.args,
  currentRoute: "/",
  pageTitle: "Application Template",
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
