import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import SourceBranchSync from "mdi-material-ui/SourceBranchSync";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { WidgetButton } from "./widget-button";
import {
  WidgetDialog,
  WidgetDialogContent,
  WidgetDialogActions,
} from "./widget-dialog";
import { usePreviewModeControllerContext } from "./preview-mode-controller-context";

const setInitialState = (initialBranch) => {
  return {
    modalVisible: false,
    working: false,
    errorMessage: null,
    selectedBranch: initialBranch,
  };
};

export function BranchSwitcher({ onSubmit }) {
  const { branches, workingBranch } = usePreviewModeControllerContext();

  const [state, setState] = useState(setInitialState(workingBranch));

  const styles = useBranchSwitcherStyles();

  const handleOnSelectChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      selectedBranch: event.target.value,
    }));
  };

  const handleOnSubmit = async () => {
    setState((prevState) => ({
      ...prevState,
      working: true,
      errorMessage: null,
    }));

    const { status, errorMessage } = await onSubmit(state.selectedBranch);

    if (status === "SUCCESS") {
      setState((prevState) => ({ ...prevState, modalVisible: false }));
    } else if (status === "ERROR") {
      setState((prevState) => ({
        ...prevState,
        working: false,
        errorMessage,
      }));
    } else {
      throw new Error(
        "BranchSwitcher onSubmit return value is not correctly defined. Please refer to the API for guidance"
      );
    }
  };

  const cleanup = () => {
    setState(setInitialState(workingBranch));
  };

  useEffect(() => {
    setState((prevState) => ({ ...prevState, selectedBranch: workingBranch }));
  }, [workingBranch]);

  return (
    <div>
      <WidgetButton
        title="Switch Working Branch"
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            modalVisible: !prevState.modalVisible,
          }))
        }
        icon={<SourceBranchSync />}
      />

      <WidgetDialog
        open={state.modalVisible}
        id="branch-switcher"
        onExited={cleanup}
        title="Switch Working Branch"
        working={state.working}
      >
        <WidgetDialogContent>
          {state.errorMessage && (
            <Typography paragraph variant="body2" color="error" role="alert">
              {state.errorMessage}
            </Typography>
          )}

          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            disabled={state.working}
          >
            <InputLabel id="branch-select-label">Working Branch</InputLabel>
            <Select
              labelId="branch-select-label"
              id="branch-select"
              value={state.selectedBranch}
              onChange={handleOnSelectChange}
              label="Working Branch"
            >
              {branches?.map((branch) => {
                return (
                  <MenuItem value={branch.name} key={branch.name}>
                    {branch.name}
                    {branch.protected && (
                      <span className={styles.protectedLabel}>
                        &#40;protected&#41;
                      </span>
                    )}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </WidgetDialogContent>

        <WidgetDialogActions>
          <Button
            onClick={() =>
              setState((prevState) => ({ ...prevState, modalVisible: false }))
            }
            color="primary"
            variant="outlined"
            disableElevation
            size="small"
            disabled={state.working}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={handleOnSubmit}
            color="primary"
            variant="contained"
            disableElevation
            size="small"
            disabled={
              workingBranch === state.selectedBranch
                ? true
                : false || state.working
            }
          >
            {state.working ? "Working, please wait..." : "Change Branch"}
          </Button>
        </WidgetDialogActions>
      </WidgetDialog>
    </div>
  );
}

const useBranchSwitcherStyles = makeStyles((theme) => ({
  protectedLabel: {
    fontSize: theme.typography.pxToRem(14),
    marginLeft: 4,
    fontStyle: "italic",
    color: theme.palette.text.secondary,
  },
}));

BranchSwitcher.propTypes = {
  /**
   * Fired when a user requests to switch branch. Expects the return of an object indicating if the request was a success or failure. **Signature:** `async function(branchName:String) => {status: "SUCCESS"} || {status: "ERROR", errorMessage: String}`
   */
  onSubmit: PropTypes.func.isRequired,
};
