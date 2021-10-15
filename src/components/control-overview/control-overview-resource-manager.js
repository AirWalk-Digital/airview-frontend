import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";

export function ControlOverviewResourceManager({
  open,
  onClose,
  resourceData,
}) {
  if (!resourceData) return null;

  return (
    <Dialog
      aria-labelledby="control-overview-resource-manager-title"
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle id="control-overview-resource-manager-title">
        Manage Resource Exemption
      </DialogTitle>

      <DialogContent dividers>
        <span>{resourceData.ticket}</span>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          disableElevation
        >
          Cancel
        </Button>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          disableElevation
        >
          Action One
        </Button>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          disableElevation
        >
          Action Two
        </Button>
      </DialogActions>
    </Dialog>
  );
}
