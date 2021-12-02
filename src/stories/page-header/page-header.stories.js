import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";
import { makeStyles } from "@material-ui/core/styles";
import * as SearchStories from "../search/search.stories";
import * as AccordionMenuStories from "../accordion-menu/accordion-menu.stories";
import { PageHeader } from "../../components/page-header";
import { LocationProvider } from "../../hooks/use-location";
import logo from "../__resources/logo-airwalk-reply.svg";

export default {
  title: "Modules/Page Header",
  component: PageHeader,
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
  navItems: [...AccordionMenuStories.Loaded.args.navItems],
  onQueryChange: SearchStories.SingleResultFound.args.onQueryChange,
};

export const PreviewDisabled = {
  ...Template,
  args: {
    ...Template.args,
    loading: false,
    previewMode: false,
  },
};

export const Loading = {
  ...Template,
  args: {
    ...Template.args,
    loading: true,
    previewMode: false,
    navItems: [...AccordionMenuStories.Loading.args.navItems],
  },
};

export const PreviewEnabled = {
  ...Template,
  args: {
    ...Template.args,
    loading: false,
    previewMode: true,
  },
};
