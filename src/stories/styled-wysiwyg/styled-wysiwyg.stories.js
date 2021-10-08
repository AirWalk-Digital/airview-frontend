/* eslint react/prop-types: 0 */
import React from "react";
import { StyledWysiwyg } from "../../components/styled-wysiwyg";
import { makeStyles } from "@material-ui/core/styles";
import { ExampleWysiwygContent } from "./example-wysiwyg-content";

const config = {
  title: "Modules/Styled WYSIWYG",
  component: StyledWysiwyg,
  parameters: {
    layout: "fullscreen",
    controls: { disabled: true },
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
  return (
    <StyledWysiwyg {...args}>
      <ExampleWysiwygContent />
    </StyledWysiwyg>
  );
}

const Default = Template.bind({});

Default.argTypes = {
  tag: { control: false },
  children: { control: false },
  testid: { control: false },
};

const Loading = Template.bind({});

Loading.args = {
  loading: true,
};

export { Default, Loading };

export default config;
