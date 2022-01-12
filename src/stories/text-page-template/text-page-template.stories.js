import React from "react";
import dayjs from "dayjs";
import { Title, ArgsTable } from "@storybook/addon-docs";
import { action } from "@storybook/addon-actions";
import { makeStyles } from "@material-ui/core/styles";
import * as LayoutBaseStories from "../layout-base/layout-base.stories";
import { TextPageTemplate } from "../../components/text-page-template";
import { Message } from "../../components/message";

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
      defaultValue: `#### Some default title and content \n Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit officia quidem quaerat rerum, nulla recusandae illum odit unde accusantium beatae qui maiores veritatis. Eum tempore, distinctio magnam aperiam voluptates sequi?`,
      placeholder:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit officia quidem quaerat rerum, nulla recusandae illum odit unde accusantium beatae qui maiores veritatis. Eum tempore, distinctio magnam aperiam voluptates sequi?",
      additionalContent: (
        <Message
          title="Injected component"
          message="This component has been injected into the main content"
        />
      ),
    },
    {
      title: "Content Block Three",
      defaultValue: "",
      placeholder:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit officia quidem quaerat rerum, nulla recusandae illum odit unde accusantium beatae qui maiores veritatis. Eum tempore, distinctio magnam aperiam voluptates sequi?",
    },
  ],
  onEditorUploadImage: async (file) => {
    action("onEditorUploadImage")(file);

    return URL.createObjectURL(file);
  },
  previewModeController: true,
  workingRepo: "test-org/test-repository",
  workingBranch: "development",
  baseBranch: "main",
  branches: [
    { name: "main", protected: true },
    { name: "development", protected: false },
  ],
  pageMetaData: {
    title: "Text Page Template",
    reviewDate: dayjs().add(1, "month").toISOString(),
    userFacing: true,
  },
  applications: [
    {
      name: "Application One",
      id: 1,
    },
    {
      name: "Application Two",
      id: 2,
    },
  ],
  applicationTypes: [
    {
      name: "Type One",
      id: 1,
    },
    {
      name: "Type Two",
      id: 2,
    },
  ],
  environments: [
    {
      name: "Environment One",
      id: 1,
    },
    {
      name: "Environment Two",
      id: 2,
    },
  ],
  referenceTypes: ["type_one", "type_two"],
  onRequestToCreatePullRequest: async (from, to) => {
    action("onRequestToCreatePullRequest")(from, to);

    return Promise.resolve("https://github.com");
  },
};

export const Default = {
  ...Template,
  args: {
    ...Template.args,
    ...LayoutBaseStories.LoadedPreviewDisabled.args,
  },
};
