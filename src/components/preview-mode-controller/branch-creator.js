import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SourceBranchPlus from "mdi-material-ui/SourceBranchPlus";
import { WidgetButton } from "./widget-button";
import {
  WidgetDialog,
  WidgetDialogContent,
  WidgetDialogActions,
} from "./widget-dialog";
import { usePreviewModeControllerContext } from "./preview-mode-controller-context";

const initialState = {
  modalVisible: false,
  working: false,
  valid: undefined,
  branchName: "",
};

export function BranchCreator({ onSubmit }) {
  const { workingBranch } = usePreviewModeControllerContext();
  const [state, setState] = useState({ ...initialState });

  const styles = useBranchCreatorStyles();

  const regex = new RegExp("^[a-z0-9_-]+$");

  const handleOnInputChange = (event) => {
    const input = event.target.value.trim().replaceAll(" ", "-");
    setState((prevState) => ({
      ...prevState,
      branchName: input,
      valid: regex.test(input),
    }));
  };

  const handleOnSubmit = async () => {
    try {
      setState((prevState) => ({ ...prevState, working: true }));
      await onSubmit(state.branchName);
    } catch (error) {
      console.warn(error);
    } finally {
      setState((prevState) => ({ ...prevState, modalVisible: false }));
    }
  };

  const cleanup = () => {
    setState({ ...initialState });
  };

  return (
    <div>
      <WidgetButton
        title="Create Branch"
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            modalVisible: !prevState.modalVisible,
          }))
        }
        icon={<SourceBranchPlus />}
      />

      <WidgetDialog
        open={state.modalVisible}
        id="branch-creator"
        onExited={cleanup}
        title="Create Branch"
        working={state.working}
      >
        <WidgetDialogContent>
          <Typography paragraph variant="body2">
            Branching from <strong>{workingBranch}</strong>
          </Typography>
          <TextField
            label="Branch Name"
            id="branch-name"
            placeholder="my-branch-name"
            size="small"
            variant="outlined"
            fullWidth
            helperText="The branch name should contain no spaces and only use lowercase characters a to z, numbers 0 to 9, an undescore and hyphen"
            FormHelperTextProps={{
              classes: {
                contained: styles.formHelperText,
              },
            }}
            error={state.valid === undefined || state.valid ? false : true}
            autoComplete="off"
            value={state.branchName}
            onChange={handleOnInputChange}
            disabled={state.working ? true : false}
          />
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
            disabled={state.working ? true : false}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOnSubmit}
            color="primary"
            variant="contained"
            disableElevation
            size="small"
            disabled={!state.valid || state.working}
          >
            Create
          </Button>
        </WidgetDialogActions>
      </WidgetDialog>
    </div>
  );
}

const useBranchCreatorStyles = makeStyles(() => ({
  dialogContainer: {
    position: "relative",
  },
  formHelperText: {
    margin: `8px 1px 0 1px`,
  },
}));

BranchCreator.propTypes = {
  /**
   * Fired when a user requests a new branch creation. **Signature:** `function(branchName:string) => Promise`
   */
  onSubmit: PropTypes.func.isRequired,
};
