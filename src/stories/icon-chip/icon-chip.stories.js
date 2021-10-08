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
  classNames: {
    control: false,
  },
};

const Default = Template.bind({});
Default.args = {
  icon: <WarningIcon />,
  label: "chip label",
};

Default.argTypes = {
  ...Template.argTypes,
};

const Dense = Template.bind({});
Dense.args = {
  ...Default.args,
  dense: true,
};

Dense.argTypes = {
  ...Template.argTypes,
};

export { Default, Dense };
export default config;
