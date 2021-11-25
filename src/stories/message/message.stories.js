import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Message } from "../../components/message";

const config = {
  title: "Modules/Message",
  component: Message,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        root: {
          width: "100%",
          maxWidth: 1024,
          margin: "0 auto",
        },
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

function Template(args) {
  return <Message {...args} />;
}

Template.argTypes = {
  children: {
    control: false,
    table: {
      disable: true,
    },
  },
  borderColor: {
    control: {
      type: "color",
    },
  },
};

Template.args = {
  borderColor: "#000",
  title: "Message Title",
  message:
    "Proin elementum mollis libero, sit amet venenatis ipsum dapibus ut. Curabitur nec nulla id ante aliquet vehicula. Aenean posuere vulputate felis, sit amet congue sem vestibulum et.",
};

const Default = Template.bind({});

Default.argTypes = {
  ...Template.argTypes,
};

Default.args = {
  ...Template.args,
};

export default config;
export { Default };
