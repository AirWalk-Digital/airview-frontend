import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";
import { makeStyles } from "@material-ui/core/styles";
import { SingleResultFound } from "../search/search.stories";
import { PageHeader } from "../../components/page-header";
import { AccordionMenu } from "../../components/accordion-menu";
import { Search } from "../../components/search";
import { LocationProvider } from "../../hooks/use-location";
import logo from "../__resources/logo-airwalk-reply.svg";

const config = {
  title: "Modules/Page Header",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    subcomponents: { AccordionMenu, Search },
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

function Template(args) {
  return (
    <LocationProvider location="/seven">
      <PageHeader {...args} />
    </LocationProvider>
  );
}

Template.args = {
  siteTitle: "AirView",
  version: "1.0",
  logoSrc: logo,
  navItems: [
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
  ],
  onQueryChange: SingleResultFound.args.onQueryChange,
};

const PreviewDisabled = Template.bind({});
PreviewDisabled.args = {
  ...Template.args,
  loading: false,
  previewMode: false,
};

const Loading = Template.bind({});
Loading.args = {
  ...Template.args,
  loading: true,
  previewMode: false,
};

const PreviewEnabled = Template.bind({});
PreviewEnabled.args = {
  ...Template.args,
  loading: false,
  previewMode: true,
};

export { PreviewDisabled, Loading, PreviewEnabled };

export default config;
