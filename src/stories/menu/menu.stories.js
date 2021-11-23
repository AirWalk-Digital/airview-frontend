import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu } from "../../components/menu";

const config = {
  title: "Modules/Menu",
  component: Menu,
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        root: {
          width: 225,
          margin: "0 auto",
        },
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

function Template(args) {
  return <Menu {...args} />;
}

Template.args = {
  menuTitle: "Lorem ipsum dolor sit amet",
  menuTitleElement: "h6",
  menuItems: [
    {
      label: "Lorem ipsum dolor, sit amet consectetur adipisicing elit",
      url: "/menu-item-one-link",
    },
    {
      label: "Lorem ipsum dolor sit amet consectetur",
      url: "menu-item-two-link",
    },
    {
      label: "Lorem ipsum dolor sit amet, consectetur adipisicing elit rerum",
      url: "/menu-item-three-link",
    },
  ],
  collapsible: true,
  initialCollapsed: false,
};

const LoadingDefault = Template.bind({});

LoadingDefault.args = {
  ...Template.args,
  loading: true,
};

const LoadingInitialCollapsed = Template.bind({});

LoadingInitialCollapsed.args = {
  ...Template.args,
  loading: true,
  initialCollapsed: true,
};

const LoadingNotCollapsible = Template.bind({});

LoadingNotCollapsible.args = {
  ...Template.args,
  loading: true,
  collapsible: false,
};

const LoadedDefault = Template.bind({});

LoadedDefault.args = {
  ...Template.args,
  loading: false,
};

const LoadedInitialCollapsed = Template.bind({});

LoadedInitialCollapsed.args = {
  ...Template.args,
  loading: false,
  initialCollapsed: true,
};

const LoadedNotCollapsible = Template.bind({});

LoadedNotCollapsible.args = {
  ...Template.args,
  loading: false,
  collapsible: false,
};

export {
  LoadingDefault,
  LoadingInitialCollapsed,
  LoadingNotCollapsible,
  LoadedDefault,
  LoadedInitialCollapsed,
  LoadedNotCollapsible,
};

export default config;
