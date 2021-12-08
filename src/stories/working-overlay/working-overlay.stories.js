import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { WorkingOverlay } from "../../components/working-overlay";

export default {
  title: "Modules/WorkingOverlay",
  component: WorkingOverlay,
  argTypes: {
    color: {
      control: {
        type: "color",
      },
    },
  },
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

export const Visible = {
  ...Template,
};

export const NotVisible = {
  ...Template,
  args: {
    ...Template.args,
    open: false,
  },
};
