import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";

export function WidgetButton({ title, onClick, icon, disabled }) {
  return (
    <Tooltip title={disabled ? `${title} (disabled)` : title} placement="left">
      <span>
        <Fab
          color="primary"
          size="medium"
          onClick={onClick}
          disabled={disabled}
          aria-label={title}
        >
          {icon}
        </Fab>
      </span>
    </Tooltip>
  );
}

WidgetButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
};
