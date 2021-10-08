import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";

export const Main = React.forwardRef(({ children, classes }, ref) => {
  return (
    <Grid item xs={12} sm={8} component="main" className={classes} ref={ref}>
      {children}
    </Grid>
  );
});

Main.displayName = "Main";

Main.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.string,
};
