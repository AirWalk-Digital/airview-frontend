import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
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
import { debounce } from "lodash-es";
import { Link } from "../link";

/*
To do:
- Move highlighting of results from get results to memo within body of component
- Add play functions to Stories
- hide component on docs pages
- Document Props API
*/

function highlightQueryWithinString(inputString, query) {
  const keywords = query.split(/\s/);

  const regExp = new RegExp(`(${keywords.join("|")})`, "gi");

  let outputString = inputString.replaceAll(regExp, (match) => {
    return `<mark>${match}</mark>`;
  });

  return outputString;
}

function useSearch(fetchResults) {
  const initialState = {
    query: "",
    working: false,
    results: null,
    errorMessage: null,
  };

  const [state, setState] = useState({ ...initialState });

  const queryIdRef = useRef(0);

  const reset = () => {
    queryIdRef.current++;
    setState({ ...initialState });
  };

  const getResults = useCallback(
    async (query, queryId) => {
      try {
        if (queryId === queryIdRef.current) {
          setState((prevState) => ({
            ...prevState,
            working: true,
          }));
        }

        const results = await fetchResults(query);

        const highlightedResults = results.map((result) => {
          return {
            ...result,
            title: highlightQueryWithinString(result.title, query),
            description: result?.description
              ? highlightQueryWithinString(result.description, query)
              : null,
          };
        });

        if (queryId === queryIdRef.current) {
          setState((prevState) => ({
            ...prevState,
            working: false,
            results: highlightedResults,
            errorMessage: null,
          }));
        }
      } catch (error) {
        if (queryId === queryIdRef.current) {
          setState((prevState) => ({
            ...prevState,
            working: false,
            results: null,
            errorMessage: error.message,
          }));
        }
      }
    },
    [fetchResults]
  );

  const debouncedGetResults = useMemo(() => {
    return debounce((query, queryId) => getResults(query, queryId), 500);
  }, [getResults]);

  const handleOnChange = (event) => {
    event.persist();

    const query = event.target.value.trimStart();

    if (!query.length) {
      reset();
    } else {
      setState((prevState) => ({ ...prevState, query }));

      debouncedGetResults(query, queryIdRef.current);
    }
  };

  useEffect(() => {
    const currentQueryRefId = queryIdRef.current;
    return () => (queryIdRef.current = currentQueryRefId + 1);
  }, []);

  return {
    state,
    reset,
    handleOnChange,
  };
}

export function Search({ open, onRequestToClose, onQueryChange }) {
  const { state, reset, handleOnChange } = useSearch(onQueryChange);

  const styles = useStyles({});

  const handleOnRequestToClose = () => onRequestToClose();

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={handleOnRequestToClose}
      TransitionProps={{
        onExited: reset,
      }}
      classes={{ container: styles.rootContainer, paper: styles.rootPaper }}
      disableEscapeKeyDown
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
        />

        {state.query.length > 0 && (
          <IconButton
            aria-label="clear query"
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
      ) : null}
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
  resultDescription: {
    color: theme.palette.text.secondary,
  },
  resultIcon: {
    marginLeft: "auto",
  },
}));