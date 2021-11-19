import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { Link } from "../link";

export function Breadcrumb({
  links,
  activeRoute,
  maxItems = 5,
  loading,
  ...rest
}) {
  const classes = useStyles();

  return (
    <Breadcrumbs
      maxItems={maxItems}
      aria-label="breadcrumb"
      {...rest}
      aria-live="polite"
      aria-busy={loading}
    >
      {loading
        ? [...Array(5)].map((item, index) => (
            <Skeleton key={index} className={classes.loadingBreadCrumbItem} />
          ))
        : links?.map((link) => (
            <Link href={link.url} key={link.url}>
              {link.label}
            </Link>
          ))}
      {!loading && <Typography>{activeRoute}</Typography>}
    </Breadcrumbs>
  );
}

const useStyles = makeStyles({
  loadingBreadCrumbItem: {
    width: 110,
  },
});

Breadcrumb.propTypes = {
  /**
   * Presents the breadcrumbs in a lodaing state (for when fetching data async)
   */
  loading: PropTypes.bool,
  /**
   * Sets the available interactive link items
   */
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  /**
   * Sets the active route (the current page)
   */
  activeRoute: PropTypes.string,
  /**
   * Set the maximum number of breadcrumbs to display. When the value is exceeded an ellipsis in rendered inbetween
   */
  maxItems: PropTypes.number,
};
