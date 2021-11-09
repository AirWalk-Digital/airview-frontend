import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { PageHeader } from "../page-header";

function LayoutBase({ pageHeaderProps, children }) {
  const classes = useLayoutBaseStyles();

  return (
    <React.Fragment>
      <PageHeader {...pageHeaderProps} />

      <div className={classes.mainContent}>{children}</div>
    </React.Fragment>
  );
}

LayoutBase.propTypes = {
  pageTitle: PropTypes.string,
  pageHeaderProps: PropTypes.object.isRequired,
  children: PropTypes.node,
};

const useLayoutBaseStyles = makeStyles((theme) => {
  return {
    mainContent: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),

      [theme.breakpoints.up("sm")]: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
      },
    },
  };
});

export { LayoutBase };
