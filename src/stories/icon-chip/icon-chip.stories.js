import React from "react";
import { IconChip } from "../../components/icon-chip";
import WarningIcon from "@material-ui/icons/Warning";

export default {
  title: "Modules/IconChip",
  component: IconChip,
};

function Template(args) {
  return <IconChip {...args} />;
}

Template.args = {
  icon: <WarningIcon />,
  label: "Chip Label",
  color: "#000",
  labelColor: "#fff",
  dense: false,
};

Template.argTypes = {
  icon: {
    control: false,
  },
  color: {
    control: {
      type: "color",
    },
  },
  labelColor: {
    control: {
      type: "color",
    },
  },
};

export const Default = {
  ...Template,
};

export const Dense = {
  ...Template,
  args: {
    ...Template.args,
    dense: true,
  },
};
