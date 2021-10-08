import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

export function WorkingOverlay({ open }) {
  const styles = useWorkingOverlayStyles();

  if (!open) return null;

  return (
    <div className={styles.root}>
      <CircularProgress color="inherit" />
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
  open: PropTypes.bool.isRequired,
};
