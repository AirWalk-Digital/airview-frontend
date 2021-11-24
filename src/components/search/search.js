import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Dialog,
  Typography,
  CircularProgress,
  Button,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CloseIcon from "@material-ui/icons/Close";
import ReactHtmlParser from "react-html-parser";
import { useSearch } from "./use-search";
import { Link } from "../link";

export function Search({ open, onRequestToClose, onQueryChange }) {
  const inputRef = useRef();

  const { state, reset, handleOnChange, handleOnReady } = useSearch(
    onQueryChange
  );

  const styles = useStyles({});

  const handleOnRequestToClose = () => onRequestToClose();

  useEffect(() => {
    if (state.ready) {
      inputRef.current.focus();
    }
  }, [state.ready]);

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={handleOnRequestToClose}
      TransitionProps={{
        onExited: reset,
        onEntered: handleOnReady,
      }}
      classes={{ container: styles.rootContainer, paper: styles.rootPaper }}
    >
      <div className={styles.searchInputContainer}>
        {state.working ? (
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
          value={state.query}
          onChange={handleOnChange}
          ref={inputRef}
        />

        {state.query.length > 0 && (
          <IconButton
            aria-label="Clear query"
            size="small"
            className={styles.clearQueryBtn}
            onClick={reset}
          >
            <CloseIcon />
          </IconButton>
        )}

        <Button
          variant="outlined"
          disableElevation
          size="small"
          onClick={handleOnRequestToClose}
        >
          Close
        </Button>
      </div>

      {state.errorMessage || state.results ? (
        <div className={styles.searchBody}>
          {state.errorMessage || state.results.length < 1 ? (
            <div className={styles.searchFeedback}>
              <Typography align="center">
                {state.errorMessage ?? (
                  <>
                    No results found for{" "}
                    <strong>&quot;{state.query}&quot;</strong>
                  </>
                )}
              </Typography>
            </div>
          ) : null}

          {!state.errorMessage && state.results?.length >= 1 ? (
            <ul className={styles.results}>
              {state.results.map((result, index) => {
                return (
                  <li key={index}>
                    <Link
                      href={result.path}
                      noLinkStyle
                      className={styles.resultLink}
                    >
                      <div className={styles.resultDetail}>
                        <span className={styles.resultTitle}>
                          {ReactHtmlParser(result.title)}
                        </span>
                        {result?.summary ? (
                          <span className={styles.resultSummary}>
                            {ReactHtmlParser(result.summary)}
                          </span>
                        ) : null}
                      </div>

                      <ChevronRightIcon className={styles.resultIcon} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </Dialog>
  );
}

Search.propTypes = {
  /**
   * Toggles the visibility of the search UI modal
   */
  open: PropTypes.bool,
  /**
   * Callback fired when the modal requests to close **Signature:** `function() => void`
   */
  onRequestToClose: PropTypes.func,
  /**
   * Callback fired when the user has changed the query input value, expects the return of a resolved or rejected promise. **Signature:** `function(query:String) => Promise.resolve([{title:String, summary?:String, path:String }]) || Promise.reject({message:String})`
   */
  onQueryChange: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    alignItems: "flex-start",
    maxHeight: 600,
  },
  rootPaper: {
    width: "100%",
    overflow: "hidden",
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
  clearQueryBtn: {
    marginRight: theme.spacing(2),
  },
  searchBody: {
    overflow: "auto",
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  searchFeedback: {
    padding: "40px 20px",
  },
  results: {
    margin: 0,
    padding: "0px 20px",
    listStyle: "none",

    "& li:not(:last-of-type)": {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  resultLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: theme.palette.text.primary,
    padding: "10px 10px",
    margin: "10px 0",
    transition: "background-color 0.2s ease-in-out",

    "&:hover": {
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.shape.borderRadius,
    },
  },
  resultDetail: {
    marginRight: 20,

    "& mark": {
      backgroundColor: "#e7eff5",
      color: "#376485",
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  resultTitle: {
    display: "block",
  },
  resultSummary: {
    color: theme.palette.text.secondary,
  },
  resultIcon: {
    marginLeft: "auto",
  },
}));
