import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";

export function MarkdownContentLoading() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: `0 0 ${theme.spacing(2)}px 0`,
    },
  },
}));
