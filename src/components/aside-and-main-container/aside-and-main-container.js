import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

export function AsideAndMainContainer({
  rootClasses,
  gridContainerClasses,
  children,
}) {
  const styles = useStyles();

  return (
    <Container className={rootClasses}>
      <Grid
        container
        component="section"
        spacing={2}
        className={clsx(gridContainerClasses, styles.gridContainerRoot)}
      >
        {children}
      </Grid>
    </Container>
  );
}

const useStyles = makeStyles({
  gridContainerRoot: {
    justifyContent: "space-between",
  },
});

AsideAndMainContainer.propTypes = {
  rootClasses: PropTypes.node,
  gridContainerClasses: PropTypes.node,
  children: PropTypes.node,
};
