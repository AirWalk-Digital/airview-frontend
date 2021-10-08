import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { HomepageTemplate } from "../../components/homepage-template/";

const config = {
  title: "Templates/Homepage Template",
  component: HomepageTemplate,
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
  return <HomepageTemplate {...args} />;
}

Template.args = {
  currentRoute: "/",
  siteTitle: "AirView",
  pageTitle: "Application Template",
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
