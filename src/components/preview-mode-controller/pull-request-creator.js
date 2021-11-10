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
  status: "INITIAL",
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
      status: "WORKING",
    }));

    const { status, pullRequestUrl, errorMessage } = await onSubmit(
      workingBranch,
      baseBranch
    );

    if (status === "SUCCESS") {
      setState((prevState) => ({
        ...prevState,
        status,
        pullRequestUrl,
      }));
    } else if (status === "ERROR") {
      setState((prevState) => ({
        ...prevState,
        status,
        errorMessage,
      }));
    } else {
      throw new Error(
        "PullRequestCreator onSubmit return value is not correctly defined. Please refer to the API for guidance"
      );
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
        working={state.status === "WORKING"}
      >
        <WidgetDialogContent>
          {state.status === "ERROR" && (
            <React.Fragment>
              <Typography paragraph variant="body2" color="error">
                {state.errorMessage}
              </Typography>
            </React.Fragment>
          )}

          {state.status === "SUCCESS" && (
            <React.Fragment>
              <Typography paragraph variant="body2">
                Your pull request has been successfully created, you can view
                the PR by following the link below.
              </Typography>
            </React.Fragment>
          )}

          {state.status === "SUCCESS" && (
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

          {state.status !== "SUCCESS" ? (
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
            disabled={state.status === "WORKING"}
          >
            {state.status !== "SUCCESS" ? "Cancel" : "Close"}
          </Button>

          {state.status !== "SUCCESS" ? (
            <Button
              onClick={handleOnCreatePr}
              color="primary"
              variant="contained"
              disableElevation
              size="small"
              disabled={state.status === "WORKING"}
            >
              {state.status === "WORKING"
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
   * Fired when a user requests to raise a pull request. Expects the return of an object indicating if the request was a success or failure. **Signature:** `async function(fromBranch: String, toBranch: String) => Promise.resolve({status: "SUCCESS", pullRequestUrl: String} || {status: "ERROR", errorMessage: String})`
   */
  onSubmit: PropTypes.func.isRequired,
};
