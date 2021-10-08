/* eslint react-hooks/exhaustive-deps: 0 */
import { useEffect, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "INITIALIZE": {
      return {
        groups: action.payload,
        controls: undefined,
        instances: undefined,
      };
    }
    case "SET_CONTROL_DATA": {
      return {
        ...state,
        controls: {
          ...state?.controls,
          [action.id]: action.payload,
        },
      };
    }
    case "SET_INSTANCE_DATA": {
      return {
        ...state,
        instances: {
          ...state?.instances,
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

  async function setControlData(id, endpoint) {
    const groupDataValue = state?.controls?.[id];

    if (
      groupDataValue !== "loading" &&
      (groupDataValue === undefined || groupDataValue === "error")
    ) {
      dispatch({ type: "SET_CONTROL_DATA", id, payload: "loading" });

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          dispatch({ type: "SET_CONTROL_DATA", id, payload: "error" });
        } else {
          dispatch({ type: "SET_CONTROL_DATA", id, payload: data });
        }
      } catch {
        dispatch({ type: "SET_CONTROL_DATA", id, payload: "error" });
      }
    }
  }

  async function setInstanceData(id, endpoint) {
    const instanceDataValue = state?.instances?.[id];

    if (
      instanceDataValue !== "loading" &&
      (instanceDataValue === undefined || instanceDataValue === "error")
    ) {
      dispatch({ type: "SET_INSTANCE_DATA", id, payload: "loading" });

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          dispatch({ type: "SET_INSTANCE_DATA", id, payload: "error" });
        } else {
          dispatch({ type: "SET_INSTANCE_DATA", id, payload: data });
        }
      } catch {
        dispatch({ type: "SET_INSTANCE_DATA", id, payload: "error" });
      }
    }
  }

  return [state, setControlData, setInstanceData, initializeData];
}

export { useControlOverviewController };
