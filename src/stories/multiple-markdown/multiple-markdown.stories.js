import React, { useEffect, useRef } from "react";
import Editor from "rich-markdown-editor";
import { action } from "@storybook/addon-actions";

export default {
  title: "Misc/Multiple Markdown",
  parameters: {
    layout: "padded",
  },
};

function Template(args) {
  const { readOnly, onChange, uploadImage } = args;

  const editorRefs = useRef([]);

  useEffect(() => {
    console.log(editorRefs);

    const headings = editorRefs.current.reduce((prevValue, currentValue) => {
      if (!currentValue) return prevValue;
      return [...prevValue, ...currentValue.getHeadings()];
    }, []);

    console.log(headings);
  });

  useEffect(() => {
    if (editorRefs?.current.length > 0) {
      editorRefs.current = [];
      console.log("resetting");
    }
  }, [readOnly, args.blocks]);

  return args.blocks.map(({ title, placeholder, defaultValue }, index) => {
    return (
      <div key={index} style={{ padding: "0.5em 1em" }}>
        <h2>{title}</h2>
        <Editor
          {...{ placeholder, defaultValue, readOnly, onChange, uploadImage }}
          ref={(ref) => editorRefs.current.push(ref)}
        />
      </div>
    );
  });
}

Template.args = {
  blocks: [
    {
      title: "Section one",
      placeholder:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit officia quidem quaerat rerum, nulla recusandae illum odit unde accusantium beatae qui maiores veritatis. Eum tempore, distinctio magnam aperiam voluptates sequi?",
    },
    {
      title: "Section two",
      defaultValue: "# Section two contents",
    },
    {
      title: "Section three",
      defaultValue: "Section three contents",
    },
  ],
  readOnly: false,
  onChange: (edits) => action("onChange")(edits()),
  uploadImage: async (file) => {
    action("uploadImage")(file);

    return URL.createObjectURL(file);
  },
};

export const Default = Template.bind({});

Default.args = {
  ...Template.args,
};

/*
Observations:
- On save are we going to push all docs or attempt to work out which one has changed? - looks like we have this available TEST
- Heading IDs duplicate as each individual markdown block is unaware of the other one - ticket write up for backlog / later
- Placeholder does not like multiline content - potential CSS issue
*/
