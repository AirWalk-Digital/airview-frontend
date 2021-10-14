/* eslint react-hooks/exhaustive-deps: 0 */
import { useEffect, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "INITIALIZE": {
      return {
        groups: action.payload,
        controls: undefined,
        resources: undefined,
      };
    }
    case "SET_CONTROLS_DATA": {
      return {
        ...state,
        controls: {
          ...state?.controls,
          [action.id]: action.payload,
        },
      };
    }
    case "SET_RESOURCES_DATA": {
      return {
        ...state,
        resources: {
          ...state?.resources,
          [action.id]: action.payload,
        },
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useControlOverviewController(getInitalData) {
  const [state, dispatch] = useReducer(reducer);

  useEffect(() => {
    initializeData();
  }, []);

  async function initializeData() {
    dispatch({ type: "INITIALIZE", payload: "loading" });

    const data = await getInitalData();
    dispatch({ type: "INITIALIZE", payload: data });
  }

  async function setControlsData(id, getData) {
    const groupDataValue = state?.controls?.[id];

    if (
      groupDataValue !== "loading" &&
      (groupDataValue === undefined || groupDataValue === "error")
    ) {
      dispatch({ type: "SET_CONTROLS_DATA", id, payload: "loading" });

      const data = await getData();
      dispatch({ type: "SET_CONTROLS_DATA", id, payload: data });
    }
  }

  async function setResourcesData(id, getData) {
    const resourcesDataValue = state?.resources?.[id];

    if (
      resourcesDataValue !== "loading" &&
      (resourcesDataValue === undefined || resourcesDataValue === "error")
    ) {
      dispatch({ type: "SET_RESOURCES_DATA", id, payload: "loading" });

      const data = await getData();
      dispatch({ type: "SET_RESOURCES_DATA", id, payload: data });
    }
  }

  return [state, setControlsData, setResourcesData, initializeData];
}

export { useControlOverviewController };
