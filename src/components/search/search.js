import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import { Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Link } from "../link";

export function Search({
  open,
  onClose,
  onChange,
  query,
  working,
  results,
  error,
  errorMessage,
}) {
  const styles = useStyles();

  const onModalClosed = () => {};

  const handleOnChange = (event) => {
    const { value } = event.target;
    onChange(value);
  };

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
            value={query}
            onChange={handleOnChange}
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

        {error || results?.length < 1 ? (
          <div className={styles.searchFeedback}>
            <Typography align="center" color={error ? "error" : "primary"}>
              {error ? (
                errorMessage
              ) : (
                <>
                  No results found for <strong>&quot;{query}&quot;</strong>
                </>
              )}
            </Typography>
          </div>
        ) : null}

        {!error && results?.length > 0 ? (
          <ul className={styles.results}>
            {results.map((result, index) => (
              <li key={index}>
                <Link
                  href={result.url}
                  noLinkStyle
                  className={styles.resultLink}
                >
                  <div className={styles.resultDetail}>
                    <span className={styles.resultTitle}>{result.title}</span>
                    {result?.description ? (
                      <span className={styles.resultDescription}>
                        {result.description}
                      </span>
                    ) : null}
                  </div>

                  <ChevronRightIcon />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Dialog>
  );
}

Search.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  query: PropTypes.string,
  working: PropTypes.bool,
  results: PropTypes.array,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
};

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
  searchFeedback: {
    padding: "40px 20px",
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  results: {
    margin: 0,
    padding: "0px 20px",
    borderTop: `1px solid ${theme.palette.divider}`,
    listStyle: "none",
    maxHeight: 300,
    overflow: "auto",

    "& li:not(:last-of-type)": {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  resultLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: theme.palette.text.primary,
    padding: "10px 20px",
    margin: "10px 0",

    "&:hover": {
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.shape.borderRadius,
    },
  },
  resultDetail: {
    marginRight: 20,
  },
  resultTitle: {
    display: "block",
    fontWeight: theme.typography.fontWeightBold,
  },
  resultDescription: {
    color: theme.palette.text.secondary,
  },
}));
