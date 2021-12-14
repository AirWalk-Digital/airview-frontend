import React, { useEffect, useRef, useState } from "react";
import { MarkdownContent } from "../../components/markdown-content";

export function StructuredPage() {
  const format = [
    { id: "one.md", title: "Section One", body: "some placeholder" },
    { id: "two.md", title: "Section Two", body: "second placeholder" },
    { id: "three.md", title: "Section Three", body: "third placeholder" },
  ];

  let files = [];
  files["two.md"] = {
    markdown:
      "### Actual Content Heading \n Here is some actual content not just placeholder",
    images: [],
  };
  const [state, setState] = useState(files);

  /* useEffect(console.log(state)); */

  const mapped = format.map((item) => ({
    ...item,
    content: files[item.id]?.markdown,
  }));

  return (
    <React.Fragment>
      {mapped.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <MarkdownContent
              readOnly={true}
              defaultValue={`# ${item.title}`}
              onChange={() => {}}
              onRequestToUploadImage={() => {}}
              ref={useRef()}
              loading={false}
            />
            <MarkdownContent
              readOnly={false}
              defaultValue={item.content}
              placeholder={item.body}
              headingsOffset={1}
              onChange={(value) => {
                const prevState = state;
                prevState[item.id] = value;
                setState(prevState);
              }}
              onRequestToUploadImage={() => {}}
              ref={useRef()}
              loading={false}
            />
          </React.Fragment>
        );
      })}
      <button onClick={() => console.log(state)}> Save</button>
    </React.Fragment>
  );
}
