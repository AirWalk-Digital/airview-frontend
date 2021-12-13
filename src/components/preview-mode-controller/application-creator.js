import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import ServerPlus from "mdi-material-ui/ServerPlus";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FormLabel from "@material-ui/core/FormLabel";
import { WidgetButton } from "./widget-button";
import {
  WidgetDialog,
  WidgetDialogContent,
  WidgetDialogActions,
} from "./widget-dialog";

const setInitialState = () => {
  return {
    formError: false,
    errorMessage: null,
    modalVisible: false,
    working: false,
    parentId: {
      value: "",
    },
    name: {
      value: "",
      valid: false,
    },
    applicationType: {
      value: "",
      valid: false,
    },
    environmentId: {
      value: "",
      valid: false,
    },
    references: [],
  };
};

export function ApplicationCreator({
  applications,
  applicationTypes,
  referenceTypes,
  environments,
  onSubmit,
}) {
  const styles = useStyles();

  const [state, setState] = useState(setInitialState());

  const handleOnWidgetButtonClick = () => {
    setState((prevState) => ({
      ...prevState,
      modalVisible: !prevState.modalVisible,
    }));
  };

  const handleOnParentApplicationChange = (event) => {
    const value = event.target.value;

    setState((prevState) => ({
      ...prevState,
      parentId: {
        value: value,
      },
    }));
  };

  const handleOnApplicationNameChange = (event) => {
    const value = event.target.value;

    setState((prevState) => ({
      ...prevState,
      name: {
        value,
        valid: value && value.length ? true : false,
      },
    }));
  };

  const handleOnApplicationTypeChange = (event) => {
    const value = event.target.value;

    setState((prevState) => ({
      ...prevState,
      applicationType: {
        value,
        valid: true,
      },
    }));
  };

  const handleOnEnvironmentTypeChange = (event) => {
    const value = event.target.value;

    setState((prevState) => ({
      ...prevState,
      environmentId: {
        value,
        valid: true,
      },
    }));
  };

  const handleOnReferenceInputChange = (index, key, event) => {
    const value = event.target.value;

    setState((prevState) => ({
      ...prevState,
      references: [
        ...prevState.references.map((reference, referenceIndex) => {
          if (referenceIndex === index) {
            return {
              ...reference,
              [key]: {
                value,
                valid: value && value.length ? true : false,
              },
            };
          }

          return { ...reference };
        }),
      ],
    }));
  };

  const handleOnDeleteReferenceClick = (index) => {
    setState((prevState) => ({
      ...prevState,
      references: [
        ...prevState.references.filter((reference, referenceIndex) => {
          return referenceIndex !== index;
        }),
      ],
    }));
  };

  const handleOnCreateReferenceClick = () => {
    setState((prevState) => ({
      ...prevState,
      references: [
        ...prevState.references,
        {
          type: {
            value: "",
            valid: false,
          },
          reference: {
            value: "",
            valid: false,
          },
        },
      ],
    }));
  };

  const isFormValid = useMemo(() => {
    let formValid = true;

    if (
      !state.name.valid ||
      !state.applicationType.valid ||
      !state.environmentId.valid ||
      !state.references.length
    ) {
      formValid = false;
      return formValid;
    }

    state.references.every((reference) => {
      if (!reference.type.valid || !reference.reference.valid) {
        formValid = false;
        return false;
      }

      return true;
    });

    return formValid;
  }, [
    state.name,
    state.applicationType,
    state.environmentId,
    state.references,
  ]);

  const handleOnSubmit = async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        working: true,
        errorMessage: null,
      }));

      await onSubmit({
        applicationType: state.applicationType.value,
        name: state.name.value,
        environmentId: state.environmentId.value,
        references: state.references.map((reference) => ({
          type: reference.type.value,
          reference: reference.reference.value,
        })),
        parentId:
          !state.parentId.value || state.parentId.value.length
            ? null
            : state.parentId.value,
      });

      setState((prevState) => ({
        ...prevState,
        modalVisible: false,
      }));
    } catch ({ error: errorMessage }) {
      setState((prevState) => ({
        ...prevState,
        errorMessage,
        working: false,
      }));
    }
  };

  const cleanup = () => {
    setState(setInitialState());
  };

  return (
    <div>
      <WidgetButton
        title="Create New Application"
        onClick={handleOnWidgetButtonClick}
        icon={<ServerPlus />}
      />

      <WidgetDialog
        open={state.modalVisible}
        id="application-creator"
        onExited={cleanup}
        title="Create New Application"
        working={state.working}
      >
        <WidgetDialogContent>
          <Typography
            color={state.errorMessage ? "error" : "initial"}
            variant="body2"
            role={state.errorMessage ? "alert" : null}
          >
            {state.errorMessage ?? (
              <span>
                <strong>Note:</strong> Fields marked with an asterisk are
                required.
              </span>
            )}
          </Typography>

          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            disabled={state.working}
          >
            <InputLabel id="parent-application-select-label">
              Parent Application
            </InputLabel>

            <Select
              labelId="parent-application-select-label"
              id="parent-application-select"
              value={state.parentId.value}
              onChange={handleOnParentApplicationChange}
              label="Parent Application"
            >
              <MenuItem value="no-parent">No Parent</MenuItem>

              {applications?.map((application) => {
                return (
                  <MenuItem value={application.id} key={application.id}>
                    {application.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <TextField
            label="Application Name"
            id="application-name"
            placeholder="My Application Name"
            size="small"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            error={false}
            autoComplete="off"
            value={state.name.value}
            onChange={handleOnApplicationNameChange}
            disabled={state.working}
          />

          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            required
            disabled={state.working}
          >
            <InputLabel id="application-type-select-label">
              Application Type
            </InputLabel>

            <Select
              labelId="application-type-select-label"
              id="application-type"
              value={state.applicationType.value}
              onChange={handleOnApplicationTypeChange}
              label="Application Type"
            >
              {applicationTypes?.map((application) => {
                return (
                  <MenuItem value={application.id} key={application.id}>
                    {application.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            disabled={state.working}
          >
            <InputLabel id="environment-select-label">Environment</InputLabel>

            <Select
              labelId="environment-select-label"
              id="environment"
              value={state.environmentId.value}
              onChange={handleOnEnvironmentTypeChange}
              label="Environment"
            >
              {environments?.map((environment) => {
                return (
                  <MenuItem value={environment.id} key={environment.id}>
                    {environment.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Divider className={styles.divider} />

          <Paper
            component="fieldset"
            variant="outlined"
            className={styles.fieldset}
          >
            <FormLabel component="legend" required>
              References
            </FormLabel>

            {state.references.map((reference, index) => {
              return (
                <div className={styles.reference} key={index}>
                  <div className={styles.referenceInputs}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      margin="normal"
                      required
                      disabled={state.working}
                    >
                      <InputLabel id={`reference-type-label-${index}`}>
                        Reference Type
                      </InputLabel>

                      <Select
                        labelId={`reference-type-label-${index}`}
                        id={`type-${index}`}
                        value={reference.type.value}
                        onChange={(event) =>
                          handleOnReferenceInputChange(index, "type", event)
                        }
                        label="Reference Type"
                      >
                        {referenceTypes.map((referenceType, index) => {
                          return (
                            <MenuItem value={referenceType} key={index}>
                              {referenceType}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Reference Label"
                      id={`reference-${index}`}
                      placeholder="Reference"
                      size="small"
                      variant="outlined"
                      fullWidth
                      required
                      margin="dense"
                      error={false}
                      autoComplete="off"
                      value={reference.reference.value}
                      onChange={(event) =>
                        handleOnReferenceInputChange(index, "reference", event)
                      }
                      disabled={state.working}
                    />
                  </div>

                  <div className={styles.referenceActions}>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      className={styles.deleteReference}
                      onClick={() => handleOnDeleteReferenceClick(index)}
                      disabled={state.working}
                    >
                      <DeleteIcon color="error" fontSize="medium" />
                    </IconButton>
                  </div>
                </div>
              );
            })}

            <Button
              onClick={handleOnCreateReferenceClick}
              color="primary"
              variant="outlined"
              disableElevation
              size="small"
              className={styles.addReferenceButton}
              disabled={state.working}
            >
              Add Reference
            </Button>
          </Paper>
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
            onClick={handleOnSubmit}
            color="primary"
            variant="contained"
            disableElevation
            size="small"
            disabled={!isFormValid || state.working}
          >
            {state.working ? "Working, please wait..." : "Create"}
          </Button>
        </WidgetDialogActions>
      </WidgetDialog>
    </div>
  );
}

ApplicationCreator.propTypes = {
  /**
   * Used to populate the parent application dropdown select
   */
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  /**
   * Used to populate the application type dropdown select
   */
  applicationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  /**
   * Used to populate the environments dropdown select
   */
  environments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  /**
   * Used to populate the references type dropdown select
   */
  referenceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * Fired when a user requests to create a new application. Expects the return of a resolved or rejected promise, resolve with no arguments or reject with an error message (String). **Signature:** `function(formData:Object) => Promise.resolve() || Promise.reject(errorMessage: String)`
   */
  onSubmit: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2.5, 0, 1.75, 0),
  },
  fieldset: {
    margin: theme.spacing(1, 0),
    width: "100%",
  },
  addReferenceButton: {
    margin: theme.spacing(1, 0),
  },
  reference: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: theme.spacing(1.25),
    marginBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  referenceInputs: {
    flex: "1 1 auto",
  },
  referenceActions: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(0.75, 0, 0.75, 0.75),
  },
}));
