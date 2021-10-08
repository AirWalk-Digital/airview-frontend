import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ProgressBar } from "../../components/progress-bar";

const config = {
  title: "Modules/ProgressBar",
  component: ProgressBar,
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        "@global": {
          "#root": {
            flex: 1,
          },
        },
        root: {
          width: "100%",
          maxWidth: 1024,
          margin: "0 auto",
          flex: 1,
        },
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

function Template(args) {
  return <ProgressBar {...args} />;
}

Template.argTypes = {
  ariaLabel: {
    control: false,
  },
  classNames: {
    control: false,
  },
  color: {
    control: {
      type: "color",
    },
  },
  value: {
    control: {
      type: "number",
      min: 0,
      max: 100,
      step: 1,
    },
  },
};

const Default = Template.bind({});

Default.args = {
  value: 33,
};

Default.argTypes = {
  ...Template.argTypes,
};

const WithoutLabel = Template.bind({});

WithoutLabel.args = {
  value: 33,
  showLabel: false,
};

WithoutLabel.argTypes = {
  ...Template.argTypes,
};

const Determinate = Template.bind({});

Determinate.args = {
  value: 33,
  variant: "determinate",
};

Determinate.argTypes = {
  ...Template.argTypes,
};

const Indeterminate = Template.bind({});

Indeterminate.args = {
  variant: "indeterminate",
  showLabel: false,
};

Indeterminate.argTypes = {
  ...Template.argTypes,
  value: {
    control: false,
  },
};

export { Default, WithoutLabel, Determinate, Indeterminate };
export default config;
