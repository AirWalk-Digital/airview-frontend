import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SaveIcon from "@material-ui/icons/Save";
import { WidgetButton } from "./widget-button";
import {
  WidgetDialog,
  WidgetDialogContent,
  WidgetDialogActions,
} from "./widget-dialog";

const initialState = {
  modalVisible: false,
  working: false,
  valid: undefined,
  commitMessage: "",
};

export function ContentCommitter({ disabled = false, onSubmit }) {
  const [state, setState] = useState({ ...initialState });

  const styles = useContentCommitterStyles();

  const handleOnInputChange = (event) => {
    const input = event.target.value.trimStart();
    setState((prevState) => ({
      ...prevState,
      commitMessage: input,
      valid: input.length > 0 && input.length < 72,
    }));
  };

  const handleOnSubmit = async () => {
    try {
      setState((prevState) => ({ ...prevState, working: true }));
      await onSubmit(state.commitMessage);
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
        title="Commit Changes"
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            modalVisible: !prevState.modalVisible,
          }))
        }
        icon={<SaveIcon />}
        disabled={disabled}
      />

      <WidgetDialog
        open={state.modalVisible}
        id="content-commiter"
        onExited={cleanup}
        title="Commit Changes to Remote"
        working={state.working}
      >
        <WidgetDialogContent>
          <Typography paragraph variant="body2">
            Enter a commit message for your changes
          </Typography>

          <TextField
            label="Commit Message"
            id="commit-message"
            placeholder="My commit message"
            size="small"
            variant="outlined"
            fullWidth
            helperText="The commit message should be a short summary of 72 chars or less"
            FormHelperTextProps={{
              classes: {
                contained: styles.formHelperText,
              },
            }}
            error={state.valid === undefined || state.valid ? false : true}
            autoComplete="off"
            value={state.commitMessage}
            onChange={handleOnInputChange}
            disabled={state.working ? true : false}
            multiline
            rows={3}
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
            Commit
          </Button>
        </WidgetDialogActions>
      </WidgetDialog>
    </div>
  );
}

const useContentCommitterStyles = makeStyles(() => ({
  dialogContainer: {
    position: "relative",
  },
  formHelperText: {
    margin: `8px 1px 0 1px`,
  },
}));

ContentCommitter.propTypes = {
  /**
   * Fired when a user requests to save content. **Signature:** `function() => Promise`
   */
  onSubmit: PropTypes.func.isRequired,
};
