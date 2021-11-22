import React from "react";
import { IconChip } from "../../components/icon-chip";
import WarningIcon from "@material-ui/icons/Warning";

const config = {
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

const Default = Template.bind({});
Default.args = {
  ...Template.args,
};

Default.argTypes = {
  ...Template.argTypes,
};

const Dense = Template.bind({});
Dense.args = {
  ...Template.args,
  dense: true,
};

Dense.argTypes = {
  ...Template.argTypes,
};

export { Default, Dense };
export default config;
