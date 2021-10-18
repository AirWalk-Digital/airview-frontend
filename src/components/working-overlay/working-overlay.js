import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";

export function WorkingOverlay({ open, ...rest }) {
  const styles = useWorkingOverlayStyles();

  const { className, ...otherProps } = rest;

  if (!open) return null;

  return (
    <div className={clsx(styles.root, className)} {...otherProps}>
      <CircularProgress color="primary" />
    </div>
  );
}

const useWorkingOverlayStyles = makeStyles({
  root: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0, 0.1)",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

WorkingOverlay.propTypes = {
  /**
   * Toggles the visibility of the component
   */
  open: PropTypes.bool.isRequired,
};
