import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";
import { action } from "@storybook/addon-actions";
import { makeStyles } from "@material-ui/core/styles";
import * as LayoutBaseStories from "../layout-base/layout-base.stories";
import { TextPageTemplate } from "../../components/text-page-template";

export default {
  title: "Templates/Text Page Template",
  component: TextPageTemplate,
  parameters: {
    layout: "fullscreen",
    docs: {
      page: () => (
        <>
          <Title />
          <ArgsTable />
        </>
      ),
    },
  },
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        "@global": {
          "#docs-root .MuiAppBar-root": {
            position: "initial",
          },
        },
        root: {},
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

function Template(args) {
  return <TextPageTemplate {...args} />;
}

Template.args = {
  relatedContent: {
    title: "Related Content",
    links: [
      {
        label: "Related Link Item One",
        url: "/",
      },
      {
        label: "Related Link Item Two",
        url: "/",
      },
    ],
  },
  mainContent: [
    {
      title: "Content Block One",
      placeholder:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit officia quidem quaerat rerum, nulla recusandae illum odit unde accusantium beatae qui maiores veritatis. Eum tempore, distinctio magnam aperiam voluptates sequi?",
    },
    {
      title: "Content Block Two",
      defaultValue: "#### Default value two ",
      additionalContent: <span>Component test</span>,
    },
    {
      title: "Content Block Three",
      defaultValue: "#### Default value three",
      additionalContent: <span>Component test two</span>,
    },
  ],
  onEditorChange: (markdown) => action("onChange")(markdown),
  onEditorUploadImage: async (file) => {
    action("onEditorUploadImage")(file);

    return URL.createObjectURL(file);
  },
};

export const Default = {
  ...Template,
  args: {
    ...Template.args,
    ...LayoutBaseStories.LoadedPreviewDisabled.args,
  },
};
