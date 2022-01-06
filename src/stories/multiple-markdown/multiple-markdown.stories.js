import React, { useEffect } from "react";
import Editor from "rich-markdown-editor";
import { action } from "@storybook/addon-actions";

export default {
  title: "Misc/Multiple Markdown",
  parameters: {
    layout: "padded",
  },
};

function useArrayRef() {
  const refs = [];
  return [refs, (el) => el && refs.push(el)];
}

function Template(args) {
  const { readOnly, onChange, uploadImage } = args;

  const [elements, ref] = useArrayRef();

  useEffect(() => {
    console.log(elements);

    const headings = elements.reduce((prevValue, currentValue) => {
      return [...prevValue, ...currentValue.getHeadings()];
    }, []);

    console.log(headings);

    args.getHeadings = () => headings;
  });

  return args.blocks.map(({ title, placeholder, defaultValue }, index) => {
    return (
      <div key={index} style={{ padding: "0.5em 1em" }}>
        <h2>{title}</h2>
        <Editor
          {...{ placeholder, defaultValue, readOnly, onChange, uploadImage }}
          ref={ref}
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
  getHeadings: (headings) => action("Headings")(headings()),
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
