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

function useControlOverviewController(initEndpoint) {
  const [state, dispatch] = useReducer(reducer);

  useEffect(() => {
    initializeData();
  }, []);

  async function initializeData() {
    dispatch({ type: "INITIALIZE", payload: "loading" });

    try {
      const response = await fetch(initEndpoint);
      const data = await response.json();

      if (!response.ok) {
        dispatch({ type: "INITIALIZE", payload: "error" });
      } else {
        dispatch({ type: "INITIALIZE", payload: data });
      }
    } catch {
      dispatch({ type: "INITIALIZE", payload: "error" });
    }
  }

  async function setControlsData(id, endpoint) {
    const groupDataValue = state?.controls?.[id];

    if (
      groupDataValue !== "loading" &&
      (groupDataValue === undefined || groupDataValue === "error")
    ) {
      dispatch({ type: "SET_CONTROLS_DATA", id, payload: "loading" });

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          dispatch({ type: "SET_CONTROLS_DATA", id, payload: "error" });
        } else {
          dispatch({ type: "SET_CONTROLS_DATA", id, payload: data });
        }
      } catch {
        dispatch({ type: "SET_CONTROLS_DATA", id, payload: "error" });
      }
    }
  }

  async function setResourcesData(id, endpoint) {
    const resourcesDataValue = state?.resources?.[id];

    if (
      resourcesDataValue !== "loading" &&
      (resourcesDataValue === undefined || resourcesDataValue === "error")
    ) {
      dispatch({ type: "SET_RESOURCES_DATA", id, payload: "loading" });

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          dispatch({ type: "SET_RESOURCES_DATA", id, payload: "error" });
        } else {
          dispatch({ type: "SET_RESOURCES_DATA", id, payload: data });
        }
      } catch {
        dispatch({ type: "SET_RESOURCES_DATA", id, payload: "error" });
      }
    }
  }

  return [state, setControlsData, setResourcesData, initializeData];
}

export { useControlOverviewController };
