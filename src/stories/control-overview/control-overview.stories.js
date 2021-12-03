import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  ControlOverview,
  useControlOverviewController,
} from "../../components/control-overview";
import docs from "./control-overview.docs.md";

export default {
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

export const WithControls = () => {
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
  }, 1);

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

  const handleOnResourceExemptionDelete = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, [1000]);
    });
  };

  const handleOnResourceExemptionSave = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
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
};

export const WithNoControls = () => {
  const data = {
    groups: [],
    controls: undefined,
    resources: undefined,
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={data}
      onRequestOfControlsData={() => {}}
      onRequestOfResourcesData={() => {}}
    />
  );
};

export const WithError = () => {
  const data = {
    groups: "error",
    controls: undefined,
    resources: undefined,
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={data}
      onRequestOfControlsData={() => {}}
      onRequestOfResourcesData={() => {}}
    />
  );
};

export const WithoutRequiredPermissions = () => {
  const data = {
    groups: null,
    controls: undefined,
    resources: undefined,
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={data}
      onRequestOfControlsData={() => {}}
      onRequestOfResourcesData={() => {}}
    />
  );
};

export const Loading = () => {
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
      onRequestOfControlsData={() => {}}
      onRequestOfResourcesData={() => {}}
    />
  );
};
