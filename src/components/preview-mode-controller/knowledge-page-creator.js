import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import ListIcon from "@material-ui/icons/List";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import DayjsUtils from "@date-io/dayjs";
import dayjs from "dayjs";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { WidgetButton } from "./widget-button";
import {
  WidgetDialog,
  WidgetDialogContent,
  WidgetDialogActions,
} from "./widget-dialog";

function KnowledgePageCreatorBase({
  onSubmit,
  initialData,
  presentErrorsOnMount = false,
  widgetDialogTitle,
  widgetButtonIcon,
  widgetButtonTitle,
  submitButtonLabel,
  disabled = false,
  id,
}) {
  const initialState = {
    modalVisible: false,
    working: false,
    errorMessage: null,
    formData: {
      title: initialData.title,
      reviewDate: dayjs(initialData.reviewDate),
      userFacing: initialData.userFacing,
    },
    formErrors: {
      title: null,
      reviewDate: null,
      userFacing: null,
    },
    touched: {
      title: presentErrorsOnMount,
      reviewDate: presentErrorsOnMount,
      userFacing: presentErrorsOnMount,
    },
    formValid: false,
    shouldValidate: true,
  };

  const [state, setState] = useState({ ...initialState });

  const styles = useKnowledgePageCreatorStyles();

  const handleOnTitleChange = (event) => {
    const value = event.target.value.trimStart();

    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        title: value,
      },
      touched: {
        ...prevState.touched,
        title: true,
      },
      shouldValidate: true,
    }));
  };

  const handleOnReviewDateChange = (date) => {
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        reviewDate: date,
      },
      touched: {
        ...prevState.touched,
        reviewDate: true,
      },
      shouldValidate: true,
    }));
  };

  const handleOnUserFacingChange = (event) => {
    const value = event.target.checked;

    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        userFacing: value,
      },
      shouldValidate: true,
    }));
  };

  const shouldFieldShowError = (fieldName) => {
    if (!state.touched[fieldName]) return;

    return state.formErrors[fieldName] === null
      ? false
      : state.formErrors[fieldName];
  };

  const validateTitle = (value) => {
    return new RegExp("^([A-z0-9 _-])+$").test(state.formData.title);
  };

  const validateReviewDate = (value) => {
    if (!state.formData.reviewDate) return false;

    const date = dayjs(state.formData.reviewDate);

    return !date.isValid() ||
      date.isBefore(new Date(), "day") ||
      date.isAfter(maxReviewDate)
      ? false
      : true;
  };

  const validateUserFacing = (value) => {
    return typeof state.formData.userFacing === "undefined" ||
      state.formData.userFacing === null
      ? false
      : true;
  };

  const validateForm = () => {
    if (!state.shouldValidate) return;

    const title = validateTitle();
    const reviewDate = validateReviewDate();
    const userFacing = validateUserFacing();

    const formValid = title && reviewDate && userFacing;

    setState((prevState) => ({
      ...prevState,
      formErrors: {
        ...prevState.formErrors,
        title: !title,
        reviewDate: !reviewDate,
        userFacing: !userFacing,
      },
      formValid,
      shouldValidate: false,
    }));
  };

  const handleOnSubmit = async () => {
    setState((prevState) => ({
      ...prevState,
      working: true,
      errorMessage: null,
    }));

    const { status, errorMessage } = await onSubmit({
      ...state.formData,
      reviewDate: state.formData.reviewDate.toISOString(),
    });

    if (status === "SUCCESS") {
      setState((prevState) => ({
        ...prevState,
        modalVisible: false,
      }));
    } else if (status === "ERROR") {
      setState((prevState) => ({
        ...prevState,
        working: false,
        errorMessage,
      }));
    } else {
      throw new Error(
        "KnowledgePageCreator/Editor onSubmit return value is not correctly defined. Please refer to the API for guidance"
      );
    }
  };

  const maxReviewDate = dayjs().add(12, "month");

  validateForm();

  return (
    <div>
      <WidgetButton
        title={widgetButtonTitle}
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            modalVisible: true,
          }))
        }
        icon={widgetButtonIcon}
        {...{ disabled }}
      />
      <WidgetDialog
        open={state.modalVisible}
        onExited={() => {
          setState({ ...initialState });
        }}
        title={widgetDialogTitle}
        working={state.working}
        {...{ id }}
      >
        <WidgetDialogContent>
          <Typography
            variant="body2"
            color={state.errorMessage ? "error" : "initial"}
            role={state.errorMessage ? "alert" : null}
          >
            {state.errorMessage ?? (
              <React.Fragment>
                <strong>Note:</strong> Fields marked with an asterisk are
                required.
              </React.Fragment>
            )}
          </Typography>

          <TextField
            label="Title"
            margin="normal"
            name="title"
            placeholder="Title"
            size="small"
            variant="outlined"
            fullWidth
            helperText={
              "The title should contain only characters a to z, numbers 0 to 9, an undescore and hyphen"
            }
            FormHelperTextProps={{
              classes: {
                contained: styles.formHelperText,
              },
            }}
            error={shouldFieldShowError("title")}
            autoComplete="off"
            value={state.formData.title}
            disabled={state.working}
            onChange={handleOnTitleChange}
            id={`${id}-title`}
            required
          />

          <MuiPickersUtilsProvider utils={DayjsUtils}>
            <KeyboardDatePicker
              name="reviewDate"
              disableToolbar
              variant="inline"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              margin="normal"
              size="small"
              fullWidth
              disablePast
              invalidDateMessage="Invalid date, please format as DD/MM/YYYY"
              minDateMessage="Date should not be a past date"
              maxDateMessage={`Date should not be greater than ${maxReviewDate.format(
                "DD/MM/YYYY"
              )}`}
              maxDate={maxReviewDate}
              error={shouldFieldShowError("reviewDate")}
              label="Review Date"
              value={state.formData.reviewDate}
              onChange={handleOnReviewDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
                size: "small",
                edge: "end",
              }}
              FormHelperTextProps={{
                classes: {
                  contained: styles.formHelperText,
                },
              }}
              required
              disabled={state.working}
              id={`${id}-review-date`}
            />
          </MuiPickersUtilsProvider>

          <FormControl margin="normal">
            <FormControlLabel
              control={
                <Switch
                  checked={state.formData.userFacing}
                  onChange={handleOnUserFacingChange}
                  name="userFacing"
                />
              }
              disabled={state.working}
              label="User Facing"
            />
          </FormControl>
        </WidgetDialogContent>

        <WidgetDialogActions>
          <Button
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                modalVisible: false,
              }))
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
            color="primary"
            variant="contained"
            disableElevation
            size="small"
            onClick={handleOnSubmit}
            disabled={state.working || !state.formValid}
          >
            {!state.working ? submitButtonLabel : "Working, please wait..."}
          </Button>
        </WidgetDialogActions>
      </WidgetDialog>
    </div>
  );
}

const useKnowledgePageCreatorStyles = makeStyles(() => ({
  dialogContainer: {
    position: "relative",
  },
  formHelperText: {
    margin: `8px 1px 0 1px`,
  },
}));

KnowledgePageCreatorBase.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    reviewDate: PropTypes.string.isRequired,
    userFacing: PropTypes.bool.isRequired,
  }).isRequired,
  widgetDialogTitle: PropTypes.string.isRequired,
  widgetButtonIcon: PropTypes.node.isRequired,
  widgetButtonTitle: PropTypes.string.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  presentErrorsOnMount: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

export function KnowledgePageCreator({ onSubmit }) {
  const initialData = {
    title: "",
    reviewDate: dayjs().add(6, "month").toISOString(),
    userFacing: false,
  };

  return (
    <KnowledgePageCreatorBase
      widgetDialogTitle="Create Knowledge Page"
      widgetButtonTitle="Create Knowledge Page"
      widgetButtonIcon={<InsertDriveFileIcon />}
      submitButtonLabel="Create"
      id="knowledge-page-creator"
      {...{ onSubmit, initialData }}
    />
  );
}

KnowledgePageCreator.propTypes = {
  /**
   * Fired when a user requests to create a Knowledge Page. Expects the return of an object indicating if the request was a success or failure. **Signature:** `async function(formData:object) => {status: "SUCCESS"} || {status: "ERROR", errorMessage: String}`
   */
  onSubmit: PropTypes.func.isRequired,
};

export function KnowledgePageMetaEditor({ onSubmit, initialData, disabled }) {
  return (
    <KnowledgePageCreatorBase
      widgetDialogTitle="Edit Knowledge Page Meta Data"
      widgetButtonTitle="Edit Knowledge Page Meta Data"
      widgetButtonIcon={<ListIcon />}
      submitButtonLabel="Save"
      presentErrorsOnMount={true}
      id="knowledge-page-meta-editor"
      {...{ onSubmit, initialData, disabled }}
    />
  );
}

KnowledgePageMetaEditor.propTypes = {
  /**
   * Fired when a user requests to edit meta data. Expects the return of an object indicating if the request was a success or failure. **Signature:** `async function(formData:object) => {status: "SUCCESS"} || {status: "ERROR", errorMessage: String}`
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Requied form data to pre-populate the form **Note:** `reviewDate` should be ISO date string
   */
  initialData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    reviewDate: PropTypes.string.isRequired,
    userFacing: PropTypes.bool.isRequired,
  }).isRequired,
};
