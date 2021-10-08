import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import SourceBranchSync from "mdi-material-ui/SourceBranchSync";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
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

  const handleOnSubmit = () => {
    onSubmit(state.selectedBranch);
    setState((prevState) => ({ ...prevState, modalVisible: false }));
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
      >
        <WidgetDialogContent>
          <FormControl variant="outlined" fullWidth size="small">
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
            disabled={workingBranch === state.selectedBranch ? true : false}
          >
            Change Branch
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
   * Fired when a user selects a branch to switch to. **Signature:** `function(branchName:string) => void`
   */
  onSubmit: PropTypes.func.isRequired,
};
