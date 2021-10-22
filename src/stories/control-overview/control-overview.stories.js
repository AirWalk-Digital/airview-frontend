import React from "react";
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
  ] = useControlOverviewController(async () => {
    try {
      const response = await fetch(`https://testapi.dev/quality-models`);

      if (response.ok) {
        return await response.json();
      }

      throw new Error();
    } catch (error) {
      return "error";
    }
  });

  const handleOnRequestOfControlsData = (id) => {
    setControlsData(id, async () => {
      try {
        const response = await fetch(
          `https://testapi.dev/applications/1/control-overviews?qualityModelId=${id}`
        );

        if (response.ok) {
          return await response.json();
        }

        throw new Error();
      } catch (error) {
        return "error";
      }
    });
  };

  const handleOnRequestOfResourcesData = (id) => {
    setResourcesData(id, async () => {
      try {
        const response = await fetch(
          `https://testapi.dev/applications/1/monitored-resources?technicalControlId=${id}`
        );

        if (response.ok) {
          return await response.json();
        }

        throw new Error();
      } catch (error) {
        return "error";
      }
    });
  };

  const handleOnResourceExemptionDelete = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve();
      }, [1000]);
    });
  };

  const handleOnResourceExemptionSave = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve();
      }, [1000]);
    });
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={state}
      onRequestOfControlsData={handleOnRequestOfControlsData}
      onRequestOfResourcesData={handleOnRequestOfResourcesData}
      onResourceExemptionDelete={handleOnResourceExemptionDelete}
      onResourceExemptionSave={handleOnResourceExemptionSave}
    />
  );
}

function WithNoControls() {
  const data = {
    groups: [],
    controls: undefined,
    resources: undefined,
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={data}
      onRequestOfControlsData={(id) => {}}
      onRequestOfResourcesData={(id) => {}}
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
      onRequestOfControlsData={(id) => {}}
      onRequestOfResourcesData={(id) => {}}
    />
  );
}

function WithoutRequiredPermissions() {
  const data = {
    groups: null,
    controls: undefined,
    resources: undefined,
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={data}
      onRequestOfControlsData={(id) => {}}
      onRequestOfResourcesData={(id) => {}}
    />
  );
}

function Loading() {
  const data = {
    groups: undefined,
    controls: undefined,
    resources: undefined,
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={data}
      loading={true}
      onRequestOfControlsData={(id) => {}}
      onRequestOfResourcesData={(id) => {}}
    />
  );
}

export default config;
export {
  Default,
  WithNoControls,
  WithError,
  WithoutRequiredPermissions,
  Loading,
};
