import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { PreviewToggler } from "./preview-toggler";
import { RepoInfo } from "./repo-info";
import { PreviewModeControllerContext } from "./preview-mode-controller-context";

export function PreviewModeController({
  enabled,
  onToggle,
  branches,
  workingRepo,
  workingBranch,
  baseBranch,
  loading,
  children,
}) {
  const styles = usePreviewModeControllerStyles();

  return (
    <PreviewModeControllerContext.Provider
      value={{
        enabled,
        onToggle,
        branches,
        workingRepo,
        workingBranch,
        baseBranch,
        loading,
      }}
    >
      <div className={styles.container}>
        <PreviewToggler classes={styles.previewTogler} />

        {enabled && !loading ? (
          <React.Fragment>
            <RepoInfo />

            <div className={styles.controllerActions}>{children}</div>
          </React.Fragment>
        ) : null}
      </div>
    </PreviewModeControllerContext.Provider>
  );
}

const usePreviewModeControllerStyles = makeStyles({
  container: {
    position: "fixed",
    bottom: 8,
    right: 8,
    display: "flex",
    flexDirection: "column-reverse",
    zIndex: 1000,
  },
  previewTogler: {
    margin: 8,
  },
  controllerActions: {
    display: "flex",
    flexDirection: "column-reverse",

    "& > *": {
      margin: 8,
    },
  },
});

PreviewModeController.propTypes = {
  /**
   * Presents the component in a loading state (for when fetching data async)
   */
  loading: PropTypes.bool,
  /**
   * Callback fired when a user clicks the toggle Preview Mode button. **Signature:** `function() => void`
   */
  onToggle: PropTypes.func,
  /**
   * An array of objects, describing the available branches
   */
  branches: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      protected: PropTypes.bool,
    })
  ),
  /**
   * The current working repository name
   */
  workingRepo: PropTypes.string,
  /**
   * The current working branch name
   */
  workingBranch: PropTypes.string,
  /**
   * The base branch name for the repository
   */
  baseBranch: PropTypes.string,
  /**
   * Any valid PreviewModeController sub-component controller widgets
   */
  children: PropTypes.node,
};
