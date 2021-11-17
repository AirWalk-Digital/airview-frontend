import React from "react";
import { Title, ArgsTable } from "@storybook/addon-docs";
import { action } from "@storybook/addon-actions";
import { Search } from "../../components/search";

const config = {
  title: "Modules/Search",
  component: Search,
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
};

const delay = process.env.NODE_ENV === "test" ? 0 : 1000;

const responses = {
  resolved: [
    {
      title: "Integer urna ipsum",
      description:
        "Feugiat ac nulla ac, urna mattis dignissim risus ipsum. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Feugiat ac nulla ac, urna mattis dignissim risus ipsum. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Feugiat ac nulla ac, urna mattis dignissim risus ipsum. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Feugiat ac nulla ac, urna mattis dignissim risus ipsum. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Feugiat ac nulla ac, urna mattis dignissim risus ipsum. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
    {
      title: "Integer urna ipsum",
      description:
        "Feugiat ac nulla ac, urna mattis dignissim risus ipsum. Sed feugiat vitae ligula eu pulvinar",
      url: "/",
    },
  ],
  rejected: { message: "There was an error" },
};

function Template(args) {
  return <Search {...args} />;
}

Template.args = {
  open: true,
};

Template.argTypes = {};

const SingleResultFound = Template.bind({});

SingleResultFound.args = {
  ...Template.args,
  onQueryChange: async (query) => {
    action("onQueryChange")(query);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([responses.resolved[0]]);
      }, delay);
    });
  },
};

SingleResultFound.argTypes = {
  ...Template.argTypes,
};

const MultipleResultsFound = Template.bind({});

MultipleResultsFound.args = {
  ...Template.args,
  onQueryChange: async (query) => {
    action("onQueryChange")(query);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(responses.resolved);
      }, delay);
    });
  },
};

MultipleResultsFound.argTypes = {
  ...Template.argTypes,
};

const NoResultsFound = Template.bind({});

NoResultsFound.args = {
  ...Template.args,
  onQueryChange: async (query) => {
    action("onQueryChange")(query);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, delay);
    });
  },
};

NoResultsFound.argTypes = {
  ...Template.argTypes,
};

const Error = Template.bind({});

Error.args = {
  ...Template.args,
  onQueryChange: async (query) => {
    action("onQueryChange")(query);

    return new Promise((_, reject) => {
      setTimeout(() => {
        reject({ message: "There was an error" });
      }, delay);
    });
  },
};

Error.argTypes = {
  ...Template.argTypes,
};

export default config;
export { SingleResultFound, MultipleResultsFound, NoResultsFound, Error };
