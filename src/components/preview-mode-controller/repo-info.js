import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { usePreviewModeControllerContext } from "./preview-mode-controller-context";

export function RepoInfo() {
  const { workingRepo, workingBranch } = usePreviewModeControllerContext();
  const styles = useRepoInfoStyles();

  return (
    <Paper className={styles.repoInfo} elevation={0} variant="outlined">
      <Typography color="textSecondary" variant="caption" component="p">
        <span>Repository:</span>
        {workingRepo}
      </Typography>

      <Typography color="textSecondary" variant="caption" component="p">
        <span>Branch:</span>
        {workingBranch}
      </Typography>
    </Paper>
  );
}

const useRepoInfoStyles = makeStyles((theme) => ({
  repoInfo: {
    position: "fixed",
    bottom: 16,
    left: 16,
    padding: theme.spacing(0.5, 0.75),
    minWidth: 100,
    marginRight: theme.spacing(2),
    fontSize: 12,

    "& span": {
      display: "inline-block",
      marginRight: theme.spacing(0.5),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
}));
