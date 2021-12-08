import React from "react";
import { MarkdownContent } from "../../components/markdown-content";
import { makeStyles } from "@material-ui/core/styles";
import markdownContent from "../__resources/markdown-content.md";

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
  defaultValue: markdownContent,
  onChange: (data) => console.log(data),
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
