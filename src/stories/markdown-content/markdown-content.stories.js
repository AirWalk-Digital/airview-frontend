import React from "react";
import { MarkdownContent } from "../../components/markdown-content";
import { makeStyles } from "@material-ui/core/styles";
import { action } from "@storybook/addon-actions";

export default {
  title: "Modules/Markdown Content",
  component: MarkdownContent,
  parameters: {
    layout: "fullscreen",
  },
  argsTypes: {
    defaultValue: {
      control: false,
    },
    ref: {
      control: false,
    },
    classNames: {
      control: false,
    },
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
  content: [
    {
      title: "Content Block One",
      placeholder:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit officia quidem quaerat rerum, nulla recusandae illum odit unde accusantium beatae qui maiores veritatis. Eum tempore, distinctio magnam aperiam voluptates sequi?",
    },
    {
      title: "Content Block Two",
      defaultValue: "Default value",
      additionalContent: <span>Component test</span>,
    },
  ],
  onChange: (markdown) => action("onChange")(markdown),
  onUploadImage: async (file) => {
    action("onUploadImage")(file);

    return URL.createObjectURL(file);
  },
};

export const Loading = {
  ...Template,
  args: {
    ...Template.args,
    readOnly: true,
    loading: true,
  },
};

export const ReadOnly = {
  ...Template,
  args: {
    ...Template.args,
    readOnly: true,
    loading: false,
  },
};

export const EditMode = {
  ...Template,
  args: {
    ...Template.args,
    readOnly: false,
    loading: false,
  },
};
