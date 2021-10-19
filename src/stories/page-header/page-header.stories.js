import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { PageHeader } from "../../components/page-header";
import { AccordionMenu } from "../../components/accordion-menu";
import { LocationProvider } from "../../hooks/use-location";
import logo from "../__resources/logo-airwalk-reply.svg";

const config = {
  title: "Modules/Page Header",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    subcomponents: { AccordionMenu },
  },
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        "@global": {
          ".MuiAppBar-root": {
            position: "initial",
          },
        },
        root: {},
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

const testNavItems = [
  {
    id: "1",
    name: "Navigation Item 1",
    url: "/one",
  },
  {
    id: "2",
    name: "Navigation Item Parent",
    children: [
      {
        id: "3",
        name: "Sub Navigation Item 1",
        url: "/two",
      },
      {
        id: "4",
        name: "Sub Navigation Item 2",
        url: "/three",
      },
      {
        id: "5",
        name: "Navigation Item Parent",
        children: [
          {
            id: "6",
            name: "Sub Navigation Item 1",
            url: "/four",
          },
          {
            id: "7",
            name: "Sub Navigation Item 2",
            url: "/five",
          },
        ],
      },
      {
        id: "6",
        name: "Sub Navigation Item 3",
        url: "/six",
      },
      {
        id: "7",
        name: "Sub Navigation Item 4",
        url: "/seven",
      },
    ],
  },
  {
    id: "8",
    name: "Navigation Item 2",
    url: "/eight",
  },
  {
    id: "9",
    name: "Navigation Item 3",
    url: "/nine",
  },
];

function Template(args) {
  return (
    <LocationProvider location="/seven">
      <PageHeader {...args} />
    </LocationProvider>
  );
}

const Default = Template.bind({});
Default.args = {
  siteTitle: "AirView",
  version: "1.0",
  logoSrc: logo,
  navItems: [...testNavItems],
};

const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  navItems: null,
  loading: true,
};

export { Default, Loading };

export default config;
