import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Divider from "@material-ui/core/Divider";
import clsx from "clsx";

export function Search({ open, onClose, working }) {
  const styles = useStyles();

  const onModalClosed = () => {};

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={onClose}
      TransitionProps={{
        onExited: onModalClosed,
      }}
      classes={{ container: styles.rootContainer, paper: styles.rootPaper }}
    >
      <div>
        <div className={styles.searchInputContainer}>
          {working ? (
            <CircularProgress size={28} />
          ) : (
            <SearchIcon className={styles.icon} />
          )}

          <input
            type="search"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Search..."
            className={styles.searchInput}
          />

          <Button
            variant="contained"
            disableElevation
            size="small"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

Search.propTypes = {};

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    height: "auto",
  },
  rootPaper: {
    width: "100%",
  },
  searchInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    fontSize: "1.75rem",
  },
  searchInput: {
    height: theme.spacing(5),
    fontSize: theme.typography.pxToRem(21),
    flex: "1 1 auto",
    padding: 0,
    margin: `0 ${theme.spacing(2)}px`,
    border: 0,
    outline: 0,

    "&::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration": {
      display: "none",
    },
  },
}));
