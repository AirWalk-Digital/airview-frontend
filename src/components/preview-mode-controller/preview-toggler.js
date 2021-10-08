import React from "react";
import PropTypes from "prop-types";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import Skeleton from "@material-ui/lab/Skeleton";
import { WidgetButton } from "./widget-button";
import { usePreviewModeControllerContext } from "./preview-mode-controller-context";

export function PreviewToggler({ classes }) {
  const { enabled, loading, onToggle } = usePreviewModeControllerContext();

  if (loading) {
    return (
      <Skeleton variant="circle" width={48} height={48} className={classes} />
    );
  }

  return (
    <div className={classes}>
      {loading}
      <WidgetButton
        title={enabled ? "Disable Preview Mode" : "Enable Preview Mode"}
        icon={enabled ? <CloseIcon /> : <EditIcon />}
        onClick={onToggle}
        disabled={loading}
        loading={loading}
      />
    </div>
  );
}

PreviewToggler.propTypes = {
  classes: PropTypes.string,
};
