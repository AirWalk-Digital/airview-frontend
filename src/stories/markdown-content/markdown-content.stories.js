import React from "react";
import { MarkdownContent } from "../../components/markdown-content";
import { makeStyles } from "@material-ui/core/styles";
import markdownContent from "../__resources/markdown-content.md";

const config = {
  title: "Modules/Markdown Content",
  component: MarkdownContent,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        root: {
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
          padding: `${16}px ${16}px 0 ${16}px`,
        },
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

function Template(args) {
  return <MarkdownContent {...args} />;
}

Template.args = {
  defaultValue: markdownContent,
  onChange: (data) => console.log(data),
};

Template.argTypes = {
  defaultValue: {
    control: false,
  },
  ref: {
    control: false,
  },
  classNames: {
    control: false,
  },
};

const ReadOnly = Template.bind({});

ReadOnly.args = {
  ...Template.args,
  readOnly: true,
  loading: false,
};

ReadOnly.argTypes = {
  ...Template.argTypes,
};

const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
  readOnly: true,
  loading: true,
};

Loading.argTypes = {
  ...Template.argTypes,
};

const EditMode = Template.bind({});

EditMode.args = {
  ...Template.args,
  readOnly: false,
  loading: false,
};

EditMode.argTypes = {
  ...Template.argTypes,
};

export default config;
export { ReadOnly, Loading, EditMode };
