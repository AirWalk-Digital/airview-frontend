import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DescriptionIcon from "@material-ui/icons/Description";
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
  sectionName: "",
};

export function PageSectionCreator({ onSubmit }) {
  const [state, setState] = useState({ ...initialState });

  const styles = usePageSectionCreatorStyles();

  const regex = new RegExp("^([A-z0-9 _-])+$");

  const handleOnInputChange = (event) => {
    const input = event.target.value.trimStart();
    setState((prevState) => ({
      ...prevState,
      sectionName: input,
      valid: regex.test(input),
    }));
  };

  const handleOnSubmit = async () => {
    try {
      setState((prevState) => ({ ...prevState, working: true }));
      await onSubmit(state.sectionName);
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
        title="Create Page Section"
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            modalVisible: !prevState.modalVisible,
          }))
        }
        icon={<DescriptionIcon />}
      />

      <WidgetDialog
        open={state.modalVisible}
        id="page-section-creator"
        onExited={cleanup}
        title="Create Page Section"
        working={state.working}
      >
        <WidgetDialogContent>
          <TextField
            label="Page Section Name"
            id="page-name"
            placeholder="My Page Section"
            size="small"
            variant="outlined"
            fullWidth
            helperText="The name should contain only characters a to z, numbers 0 to 9, an undescore and hyphen"
            FormHelperTextProps={{
              classes: {
                contained: styles.formHelperText,
              },
            }}
            error={state.valid === undefined || state.valid ? false : true}
            autoComplete="off"
            value={state.sectionName}
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

const usePageSectionCreatorStyles = makeStyles(() => ({
  dialogContainer: {
    position: "relative",
  },
  formHelperText: {
    margin: `8px 1px 0 1px`,
  },
}));

PageSectionCreator.propTypes = {
  /**
   * Fired when a user requests a new page section creation. **Signature:** `function(sectionName:string) => Promise`
   */
  onSubmit: PropTypes.func.isRequired,
};
