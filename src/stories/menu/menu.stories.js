import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu } from "../../components/menu";
import { LocationProvider } from "../../hooks/use-location";

const config = {
  title: "Modules/Menu",
  component: Menu,
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        root: {
          width: "100%",
          maxWidth: 225,
          margin: "0 auto",
        },
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

function Template(args) {
  return (
    <LocationProvider location="/some-link">
      <Menu {...args} />
    </LocationProvider>
  );
}

Template.argTypes = {
  menuItems: {
    control: false,
  },
};

const Default = Template.bind({});
Default.args = {
  menuTitle: "Menu Title",
  menuItems: [
    {
      label: "Menu item one - internal link",
      url: "/",
    },
    {
      label: "Menu item two - external link",
      url: "https://somelocation.com",
    },
    {
      label: "Menu item three - internal link current menu item",
      url: "/some-link",
    },
  ],
};

Default.argTypes = {
  ...Template.argTypes,
};

const WithIntialCollapsedTrue = Template.bind({});
WithIntialCollapsedTrue.args = {
  ...Default.args,
  initialCollapsed: true,
};

WithIntialCollapsedTrue.argTypes = {
  ...Template.argTypes,
};

const WithIntialCollapsedFalse = Template.bind({});
WithIntialCollapsedFalse.args = {
  ...Default.args,
  initialCollapsed: false,
};

WithIntialCollapsedFalse.argTypes = {
  ...Template.argTypes,
};

const WithCollapsibleTrue = Template.bind({});
WithCollapsibleTrue.args = {
  ...Default.args,
  collapsible: true,
};

WithCollapsibleTrue.argTypes = {
  ...Template.argTypes,
};

const WithCollapsibleFalse = Template.bind({});
WithCollapsibleFalse.args = {
  ...Default.args,
  collapsible: false,
};

WithCollapsibleFalse.argTypes = {
  ...Template.argTypes,
};

const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  menuItems: null,
  loading: true,
};

export {
  Default,
  WithCollapsibleTrue,
  WithCollapsibleFalse,
  WithIntialCollapsedTrue,
  WithIntialCollapsedFalse,
  Loading,
};

export default config;
