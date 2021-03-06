import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import SourceBranch from "mdi-material-ui/SourceBranch";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { WidgetButton } from "./widget-button";
import {
  WidgetDialog,
  WidgetDialogContent,
  WidgetDialogActions,
} from "./widget-dialog";
import { usePreviewModeControllerContext } from "./preview-mode-controller-context";
import { Link } from "../link";

const intialState = {
  modalVisible: false,
  status: "initial",
  errorMessage: null,
  pullRequestUrl: null,
};

export function PullRequestCreator({ onSubmit }) {
  const [state, setState] = useState({ ...intialState });
  const styles = useStyles();
  const { baseBranch, workingBranch } = usePreviewModeControllerContext();

  const handleOnWidgetButtonClick = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      modalVisible: !prevState.modalVisible,
    }));
  }, []);

  const cleanup = useCallback(() => {
    setState({ ...intialState });
  }, []);

  const handleOnCreatePr = async () => {
    setState((prevState) => ({
      ...prevState,
      status: "working",
    }));

    try {
      const pullRequestUrl = await onSubmit(workingBranch, baseBranch);

      setState((prevState) => ({
        ...prevState,
        status: "success",
        pullRequestUrl,
      }));
    } catch ({ error: errorMessage }) {
      setState((prevState) => ({
        ...prevState,
        status: "error",
        errorMessage,
      }));
    }
  };

  return (
    <div>
      <WidgetButton
        title="Create Pull Request"
        onClick={handleOnWidgetButtonClick}
        icon={<SourceBranch />}
        disabled={workingBranch === baseBranch}
      />

      <WidgetDialog
        open={state.modalVisible}
        id="pull-request-creator"
        title="Create Pull Request"
        onExited={cleanup}
        working={state.status === "working"}
      >
        <WidgetDialogContent>
          {state.status === "error" && (
            <React.Fragment>
              <Typography paragraph variant="body2" color="error" role="alert">
                {state.errorMessage}
              </Typography>
            </React.Fragment>
          )}

          {state.status === "success" && (
            <React.Fragment>
              <Typography paragraph variant="body2">
                Your pull request has been successfully created, you can view
                the PR by following the link below.
              </Typography>
            </React.Fragment>
          )}

          {state.status === "success" && (
            <Button
              color="primary"
              variant="contained"
              size="small"
              disableElevation
              startIcon={<OpenInNewIcon />}
              href={state.pullRequestUrl}
              component={Link}
              noLinkStyle
            >
              View Pull Request
            </Button>
          )}

          {state.status !== "success" ? (
            <React.Fragment>
              <Paper
                variant="outlined"
                className={clsx(
                  styles.branchDetailContainer,
                  styles.fromBranch
                )}
              >
                <div className={styles.branchDetailAdornment}>
                  <SourceBranch />
                </div>

                <div className={styles.branchDetailAdornmentDetails}>
                  <Typography variant="subtitle2">From:</Typography>
                  <Typography variant="body2">
                    <span>{workingBranch}</span>
                  </Typography>
                </div>
              </Paper>

              <Paper
                variant="outlined"
                className={styles.branchDetailContainer}
              >
                <div className={styles.branchDetailAdornment}>
                  <SourceBranch />
                </div>

                <div className={styles.branchDetailAdornmentDetails}>
                  <Typography variant="subtitle2">To:</Typography>
                  <Typography variant="body2">
                    <span>{baseBranch}</span>
                  </Typography>
                </div>
              </Paper>
            </React.Fragment>
          ) : null}
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
            disabled={state.status === "working"}
          >
            {state.status !== "success" ? "Cancel" : "Close"}
          </Button>

          {state.status !== "success" ? (
            <Button
              onClick={handleOnCreatePr}
              color="primary"
              variant="contained"
              disableElevation
              size="small"
              disabled={state.status === "working"}
            >
              {state.status === "working"
                ? "Working, please wait..."
                : "Create"}
            </Button>
          ) : null}
        </WidgetDialogActions>
      </WidgetDialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  branchDetailContainer: {
    display: "flex",
  },
  branchDetailAdornment: {
    flex: "0 0 auto",
    display: "flex",
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[800],
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  branchDetailAdornmentDetails: {
    flex: "1 1 auto",
    padding: theme.spacing(1),
  },
  fromBranch: {
    marginBottom: theme.spacing(2),
  },
}));

PullRequestCreator.propTypes = {
  /**
   * Fired when a user requests to raise a pull request. Expectes the return of a resolved or rejected promise, resolve with the URL of the pull request (String) or reject with an error message (String). **Signature:** `function(fromBranch: String, toBranch: String) => Promise.resolve(pullRequestUrl: String) || Promise.reject(errorMessage: String)`
   */
  onSubmit: PropTypes.func.isRequired,
};
