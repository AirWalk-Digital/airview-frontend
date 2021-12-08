import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu } from "../../components/menu";

export default {
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
  id: "menu-component",
};

export const LoadingDefault = {
  ...Template,
  args: {
    ...Template.args,
    loading: true,
  },
};

export const LoadingInitialCollapsed = {
  ...Template,
  args: {
    ...Template.args,
    loading: true,
    initialCollapsed: true,
  },
};

export const LoadingNotCollapsible = {
  ...Template,
  args: {
    ...Template.args,
    loading: true,
    collapsible: false,
  },
};

export const LoadedDefault = {
  ...Template,
  args: {
    ...Template.args,
    loading: false,
  },
};

export const LoadedInitialCollapsed = {
  ...Template,
  args: {
    ...Template.args,
    loading: false,
    initialCollapsed: true,
  },
};

export const LoadedNotCollapsible = {
  ...Template,
  args: {
    ...Template.args,
    loading: false,
    collapsible: false,
  },
};
