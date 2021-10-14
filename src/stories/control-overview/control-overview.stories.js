import React from "react";
import { handlers } from "./mocks/handlers";
import { makeStyles } from "@material-ui/core/styles";
import {
  ControlOverview,
  useControlOverviewController,
} from "../../components/control-overview";
import docs from "./control-overview.docs.md";

const config = {
  title: "Modules/Control Overview",
  component: ControlOverview,
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        "@global": {
          "#root": {
            flex: 1,
          },
        },
        root: {
          width: "100%",
          maxWidth: 1024,
          margin: "0 auto",
          flex: 1,
        },
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
  parameters: {
    msw: handlers,
    docs: {
      description: {
        component: docs,
      },
    },
  },
};

function Default() {
  const [
    state,
    setControlsData,
    setResourcesData,
  ] = useControlOverviewController("https://testapi.dev/quality-models");

  const handleOnRequestOfControlsData = async (id) => {
    setControlsData(
      id,
      `https://testapi.dev/applications/1/control-overviews?qualityModelId=${id}`
    );
  };

  const handleOnRequestOfResourcesData = async (id) => {
    setResourcesData(
      id,
      `https://testapi.dev/applications/1/monitored-resources?technicalControlId=${id}`
    );
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={state}
      onRequestOfControlsData={handleOnRequestOfControlsData}
      onRequestOfResourcesData={handleOnRequestOfResourcesData}
    />
  );
}

function WithNoIssues() {
  const data = {
    groups: [],
    controls: undefined,
    resources: undefined,
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={data}
      onRequestOfControlsData={(id) => console.log("group id", id)}
      onRequestOfResourcesData={(id) => console.log("control id", id)}
    />
  );
}

function WithError() {
  const data = {
    groups: "error",
    controls: undefined,
    resources: undefined,
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={data}
      onRequestOfControlsData={(id) => console.log("group id", id)}
      onRequestOfResourcesData={(id) => console.log("control id", id)}
    />
  );
}

export default config;
export { Default, WithNoIssues, WithError };
