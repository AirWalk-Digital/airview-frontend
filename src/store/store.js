import { useReducer } from "react";

function useStore(initialState) {
  // Set action types for reducer
  const actionTypes = {
    SET_ERROR_STATUS: "SET_ERROR_STATUS",
    SET_PREVIEW_MODE_STATUS: "SET_PREVIEW_MODE_STATUS",
    SET_WORKING_BRANCH_NAME: "SET_WORKING_BRANCH_NAME",
    RESET_BRANCH_NAME: "RESET_BRANCH_NAME",
    SET_EDIT_MODE_STATUS: "SET_EDIT_MODE_STATUS",
  };

  // Create pure reducer to mutate our store
  const storeReducer = (state, action) => {
    const route = action.payload.route;

    switch (action.type) {
      case actionTypes.SET_ERROR_STATUS:
        return {
          ...state,
          error: action.payload,
        };

      case actionTypes.SET_PREVIEW_MODE_STATUS:
        return {
          ...state,
          previewMode: action.payload,
        };

      case actionTypes.SET_WORKING_BRANCH_NAME:
        return {
          ...state,
          routeRepoData: {
            ...state.routeRepoData,
            [route]: {
              ...state.routeRepoData[route],
              workingBranchName: action.payload.name,
            },
          },
        };

      case actionTypes.RESET_BRANCH_NAME:
        return {
          ...state,
          routeRepoData: {
            ...state.routeRepoData,
            [route]: {
              ...state.routeRepoData[route],
              workingBranchName:
                initialState.routeRepoData[route].workingBranchName,
            },
          },
        };

      case actionTypes.SET_EDIT_MODE_STATUS:
        return {
          ...state,
          editMode: {
            ...action.payload,
          },
        };

      default:
        throw new Error(
          `Unhandled action type: ${action.type} in storeReducer`
        );
    }
  };

  // Create a React useReducer hook
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Create our dispatchers
  const dispatchers = {
    setErrorStatus: (status) => {
      dispatch({
        type: actionTypes.SET_ERROR_STATUS,
        payload: status,
      });
    },
    setPreviewModeStatus: (status) => {
      dispatch({
        type: actionTypes.SET_PREVIEW_MODE_STATUS,
        payload: status,
      });
    },
    setWorkingBranchName: (route, branchName) => {
      dispatch({
        type: actionTypes.SET_WORKING_BRANCH_NAME,
        payload: {
          route,
          name: branchName,
        },
      });
    },
    resetWorkingBranchName: (route) => {
      dispatch({
        type: actionTypes.RESET_BRANCH_NAME,
        payload: {
          route,
        },
      });
    },
  };

  // Return our state and dispatchers for use
  return { state, ...dispatchers };
}
export { useStore };
