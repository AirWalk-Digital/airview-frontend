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
  errorMessage:
    "Sorry, there was an error running the search. Please try again",
  open: true,
  working: false,
  query: "",
};

Template.argTypes = {
  onClose: {
    //action: "Modal request to close",
  },
  onExited: {
    //action: "Modal closed",
  },
  onChange: {
    // action: "Query changed",
  },
};

const Initial = Template.bind({});

Initial.args = {
  ...Template.args,
};

Initial.argTypes = {
  ...Template.argTypes,
};

const Working = Template.bind({});

Working.args = {
  ...Template.args,
  query: "integer urna ipsum",
  working: true,
};

Working.argTypes = {
  ...Template.argTypes,
};

const SingleResultFound = Template.bind({});

SingleResultFound.args = {
  ...Template.args,
  query: "integer urna ipsum",
  working: false,
  results: [
    {
      title: "Integer urna ipsum",
      description:
        "Integer urna ipsum, feugiat ac nulla ac, mattis dignissim risus. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
  ],
};

SingleResultFound.argTypes = {
  ...Template.argTypes,
};

const MultipleResultsFound = Template.bind({});

MultipleResultsFound.args = {
  ...Template.args,
  query: "integer urna ipsum",
  working: false,
  results: [
    {
      title: "Integer urna ipsum",
      description:
        "Integer urna ipsum, feugiat ac nulla ac, mattis dignissim risus. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Integer urna ipsum, feugiat ac nulla ac, mattis dignissim risus. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Integer urna ipsum, feugiat ac nulla ac, mattis dignissim risus. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Integer urna ipsum, feugiat ac nulla ac, mattis dignissim risus. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Integer urna ipsum, feugiat ac nulla ac, mattis dignissim risus. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Integer urna ipsum, feugiat ac nulla ac, mattis dignissim risus. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
  ],
};

MultipleResultsFound.argTypes = {
  ...Template.argTypes,
};

const NoResultsFound = Template.bind({});

NoResultsFound.args = {
  ...Template.args,
  query: "integer urna ipsum",
  working: false,
  results: [],
};

NoResultsFound.argTypes = {
  ...Template.argTypes,
};

const Error = Template.bind({});

Error.args = {
  ...Template.args,
  query: "integer urna ipsum",
  working: false,
  error: true,
};

Error.argTypes = {
  ...Template.argTypes,
};

export default config;
export {
  Initial,
  Working,
  SingleResultFound,
  MultipleResultsFound,
  NoResultsFound,
  Error,
};
