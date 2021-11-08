import React from "react";
import { Search } from "../../components/search";

const config = {
  title: "Modules/Search",
  component: Search,
  parameters: {
    layout: "fullscreen",
  },
};

function Template(args) {
  return <Search {...args} />;
}

Template.args = {
  results: null,
  error: false,
  errorMessage: "Sorry, there was an error running the search",
  open: true,
  working: false,
  //onChange: (query) => console.log(query),
  //onRequestToClose: () => console.log()
};

Template.argTypes = {};

const Default = Template.bind({});

Default.args = {
  ...Template.args,
};

Default.argTypes = {
  ...Template.argTypes,
};

export default config;
export { Default };
