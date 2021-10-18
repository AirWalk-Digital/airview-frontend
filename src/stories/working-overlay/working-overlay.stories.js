import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { WorkingOverlay } from "../../components/working-overlay";

const config = {
  title: "Modules/WorkingOverlay",
  component: WorkingOverlay,
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
  return <WorkingOverlay {...args} />;
}

Template.args = {
  open: true,
  color: null,
};

Template.argTypes = {
  color: {
    control: {
      type: "color",
    },
  },
};

const Visible = Template.bind({});

Visible.args = {
  ...Template.args,
};

Visible.argTypes = {
  ...Template.argTypes,
};

const NotVisible = Template.bind({});

NotVisible.args = {
  ...Template.args,
  open: false,
};

NotVisible.argTypes = {
  ...Template.argTypes,
};

export { Visible, NotVisible };
export default config;
