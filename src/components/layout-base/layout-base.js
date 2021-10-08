import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { PageHeader } from "../page-header";
//import { siteTitle } from "../../../site-config.json";

function LayoutBase({ pageTitle, pageHeaderProps, children }) {
  const classes = useLayoutBaseStyles();

  return (
    <React.Fragment>
      {/*
      To do: add head meta

      <Head>
        <title>
          {pageTitle && `${pageTitle} - `} {siteTitle}
        </title>
      </Head>
      */}

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
