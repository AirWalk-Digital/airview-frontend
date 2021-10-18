import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { WorkingOverlay } from "../working-overlay";

export function WidgetDialog({
  open,
  id,
  onExited,
  working = false,
  title,
  children,
}) {
  const styles = useWidgetDialogStyles();

  return (
    <Dialog
      aria-labelledby={id}
      open={open}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
      className={styles.dialogContainer}
      TransitionProps={{
        onExited: onExited,
      }}
    >
      <WorkingOverlay open={working} />

      <DialogTitle id={id}>{title}</DialogTitle>
      {children}
    </Dialog>
  );
}

const useWidgetDialogStyles = makeStyles({
  dialogContainer: {
    position: "relative",
  },
});

export function WidgetDialogContent({ children }) {
  return <DialogContent dividers>{children}</DialogContent>;
}

export function WidgetDialogActions({ children }) {
  return <DialogActions>{children}</DialogActions>;
}
