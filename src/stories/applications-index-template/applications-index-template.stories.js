import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";

import {
  PreviewDisabled as PreviewDisabledPageHeader,
  Loading as LoadingPageHeader,
} from "../page-header/page-header.stories";

import { makeStyles } from "@material-ui/core/styles";
import { ApplicationsIndexTemplate } from "../../components/applications-index-template";

export default {
  title: "Templates/Applications Index Template",
  component: ApplicationsIndexTemplate,
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
  return <ApplicationsIndexTemplate {...args} />;
}

Template.args = {
  currentRoute: "/applications",
  pageTitle: "Applications Template",
  breadcrumbLinks: [
    {
      label: "Home",
      url: "/",
    },
  ],
  permissionsInvalidMessage:
    "You do not have the required permissions to view the data for this application",
  noDataMessage: "There is no data to display for this application",
  progressBarColorResolver: (value) => {
    if (value >= 80) return "#4caf50";
    if (value <= 20) return "#f44336";
    return "#002b3d";
  },
};

export const Loading = {
  ...Template,
  args: {
    ...Template.args,
    ...LoadingPageHeader.args,
  },
};

export const WithEnvironmentData = {
  ...Template,
  args: {
    ...Template.args,
    ...PreviewDisabledPageHeader.args,
    applications: [
      {
        applicationName: "Application One",
        id: 1,
        url: "/",
        environments: [
          {
            environment: "Production",
            overviewValue: 80,
            low: 1,
            medium: 2,
            high: 3,
            exemptControls: 4,
          },
          {
            environment: "UAT",
            overviewValue: 40,
            low: 5,
            medium: 6,
            high: 7,
            exemptControls: 8,
          },
          {
            environment: "Development",
            overviewValue: 10,
            low: 9,
            medium: 10,
            high: 11,
            exemptControls: 12,
          },
        ],
      },
      {
        applicationName: "Application Two",
        id: 2,
        url: "/",
        environments: [
          {
            environment: "Production",
            overviewValue: 80,
            low: 13,
            medium: 14,
            high: 15,
            exemptControls: 16,
          },
          {
            environment: "UAT",
            overviewValue: 40,
            low: 17,
            medium: 18,
            high: 19,
            exemptControls: 20,
          },
          {
            environment: "Development",
            overviewValue: 10,
            low: 21,
            medium: 22,
            high: 23,
            exemptControls: 24,
          },
        ],
      },
      {
        applicationName: "Application Three",
        id: 3,
        url: "/",
        environments: [
          {
            environment: "Production",
            overviewValue: 80,
            low: 25,
            medium: 26,
            high: 27,
            exemptControls: 28,
          },
        ],
      },
      {
        applicationName: "Application Four",
        id: 4,
        url: "/",
        environments: [
          {
            environment: "Production",
            overviewValue: 80,
            low: 29,
            medium: 30,
            high: 31,
            exemptControls: 32,
          },
          {
            environment: "UAT",
            overviewValue: 40,
            low: 33,
            medium: 34,
            high: 35,
            exemptControls: 36,
          },
          {
            environment: "Development",
            overviewValue: 10,
            low: 37,
            medium: 38,
            high: 39,
            exemptControls: 40,
          },
        ],
      },
      {
        applicationName: "Application Five",
        id: 5,
        url: "/",
        environments: [
          {
            environment: "Production",
            overviewValue: 80,
            low: 41,
            medium: 42,
            high: 43,
            exemptControls: 44,
          },
          {
            environment: "UAT",
            overviewValue: 40,
            low: 45,
            medium: 46,
            high: 47,
            exemptControls: 48,
          },
          {
            environment: "Development",
            overviewValue: 10,
            low: 49,
            medium: 50,
            high: 51,
            exemptControls: 52,
          },
        ],
      },
      {
        applicationName: "Application Six",
        id: 6,
        url: "/",
        environments: [
          {
            environment: "Production",
            overviewValue: 80,
            low: 53,
            medium: 54,
            high: 55,
            exemptControls: 56,
          },
          {
            environment: "UAT",
            overviewValue: 40,
            low: 57,
            medium: 58,
            high: 59,
            exemptControls: 60,
          },
          {
            environment: "Development",
            overviewValue: 10,
            low: 61,
            medium: 62,
            high: 63,
            exemptControls: 64,
          },
        ],
      },
    ],
  },
};

export const WithoutEnvironmentData = {
  ...Template,
  args: {
    ...Template.args,
    ...PreviewDisabledPageHeader.args,
    applications: WithEnvironmentData.args.applications.map((application) => {
      return { ...application, environments: [] };
    }),
  },
};

export const WithoutRequiredPermissions = {
  ...Template,
  args: {
    ...Template.args,
    ...PreviewDisabledPageHeader.args,
    applications: WithEnvironmentData.args.applications.map((application) => {
      return { ...application, environments: null };
    }),
  },
};
