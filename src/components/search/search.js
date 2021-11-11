import React, { useCallback, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import { Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ReactHtmlParser from "react-html-parser";
import { debounce } from "lodash-es";
import { Link } from "../link";

function highlightQueryWithinString(inputString, query) {
  const keywords = query.split(/\s/);

  const regExp = new RegExp(`(${keywords.join("|")})`, "gi");

  let outputString = inputString.replaceAll(regExp, (match) => {
    return `<mark>${match}</mark>`;
  });

  return outputString;
}

const intialState = {
  query: "",
  working: false,
  results: null,
  errorMessage: null,
};

export function Search({ open, onRequestToClose, onQueryChange }) {
  const [state, setState] = useState({ ...intialState });
  const styles = useStyles();

  const onModalClosed = () => {
    setState({ ...intialState });
  };

  const getResults = useCallback(
    async (query) => {
      try {
        setState((prevState) => ({
          ...prevState,
          working: true,
        }));

        const results = await onQueryChange(query);

        const highlightedResults = results.map((result) => {
          return {
            ...result,
            title: highlightQueryWithinString(result.title, query),
            description: result?.description
              ? highlightQueryWithinString(result.description, query)
              : null,
          };
        });

        setState((prevState) => ({
          ...prevState,
          working: false,
          results: highlightedResults,
          errorMessage: null,
        }));
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          working: false,
          results: null,
          errorMessage: error.message,
        }));
      }
    },
    [onQueryChange]
  );

  const debouncedGetResults = useMemo(() => {
    return debounce((query) => getResults(query), 500);
  }, [getResults]);

  const handleOnChange = (event) => {
    event.persist();
    const query = event.target.value.trimStart();

    if (!query.length) {
      setState((prevState) => ({ ...prevState, query, results: null }));
      debouncedGetResults.cancel();
    } else {
      setState((prevState) => ({ ...prevState, query }));

      debouncedGetResults(query);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={onRequestToClose}
      TransitionProps={{
        onExited: onModalClosed,
      }}
      classes={{ container: styles.rootContainer, paper: styles.rootPaper }}
    >
      <div>
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
          />

          <Button
            variant="outlined"
            disableElevation
            size="small"
            onClick={onRequestToClose}
          >
            Close
          </Button>
        </div>

        {state.errorMessage || state.results?.length < 1 ? (
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
                    href={result.url}
                    noLinkStyle
                    className={styles.resultLink}
                  >
                    <div className={styles.resultDetail}>
                      <span className={styles.resultTitle}>
                        {ReactHtmlParser(result.title)}
                      </span>
                      {result?.description ? (
                        <span className={styles.resultDescription}>
                          {ReactHtmlParser(result.description)}
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
    </Dialog>
  );
}

Search.propTypes = {
  open: PropTypes.bool,
  onRequestToClose: PropTypes.func,
  onQueryChange: PropTypes.func,
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
    maxHeight: 500,
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
  resultDescription: {
    color: theme.palette.text.secondary,
  },
  resultIcon: {
    marginLeft: "auto",
  },
}));
