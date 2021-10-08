import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";

export function Aside({ children, classes }) {
  return (
    <Grid item xs={12} sm={4} md={3} component="aside" className={classes}>
      {children}
    </Grid>
  );
}

Aside.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.string,
};
