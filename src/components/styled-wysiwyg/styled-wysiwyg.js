import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import { styledWysiwygStyles } from "./styled-wysiwyg.styles";

const useStyles = makeStyles((theme) => styledWysiwygStyles(theme));

export const StyledWysiwyg = React.forwardRef(
  ({ tag = "div", children, testid, loading }, ref) => {
    const classes = useStyles();
    const Tag = tag;

    return (
      <Tag className={classes.root} data-testid={testid} ref={ref}>
        {loading ? (
          <React.Fragment>
            <Skeleton width="70%">
              <Typography variant="h1">.</Typography>
            </Skeleton>

            <div>
              {[...Array(7)].map((item, index) => (
                <Skeleton width="100%" key={index}>
                  <Typography>.</Typography>
                </Skeleton>
              ))}
            </div>

            <div>
              {[...Array(5)].map((item, index) => (
                <Skeleton width="100%" key={index}>
                  <Typography>.</Typography>
                </Skeleton>
              ))}
            </div>

            <Skeleton width="50%">
              <Typography variant="h2">.</Typography>
            </Skeleton>

            <div>
              {[...Array(6)].map((item, index) => (
                <Skeleton width="100%" key={index}>
                  <Typography>.</Typography>
                </Skeleton>
              ))}
            </div>

            <div>
              {[...Array(5)].map((item, index) => (
                <Skeleton width="100%" key={index}>
                  <Typography>.</Typography>
                </Skeleton>
              ))}
            </div>

            <div>
              {[...Array(3)].map((item, index) => (
                <Skeleton width="100%" key={index}>
                  <Typography>.</Typography>
                </Skeleton>
              ))}
            </div>

            <Skeleton width="50%">
              <Typography variant="h2">.</Typography>
            </Skeleton>

            <div>
              {[...Array(8)].map((item, index) => (
                <Skeleton width="100%" key={index}>
                  <Typography>.</Typography>
                </Skeleton>
              ))}
            </div>

            <div>
              {[...Array(3)].map((item, index) => (
                <Skeleton width="100%" key={index}>
                  <Typography>.</Typography>
                </Skeleton>
              ))}
            </div>
          </React.Fragment>
        ) : (
          children
        )}
      </Tag>
    );
  }
);

StyledWysiwyg.displayName = "StyledWysiwyg";

StyledWysiwyg.propTypes = {
  /**
   * Presents the component in a loading state (for when fetching data async)
   */
  loading: PropTypes.bool,
  /**
   * Sets the parent tag that renderes the WYSIWYG content
   */
  tag: PropTypes.string,
  /**
   * The HTML content nodes; for example raw HTML or rendered Markdown content
   */
  children: PropTypes.node,
  /**
   * Sets a test id on the parent node, for testing purposes
   */
  testid: PropTypes.string,
};
