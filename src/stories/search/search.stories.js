import React from "react";
import { screen, userEvent } from "@storybook/testing-library";
import { Title, ArgsTable } from "@storybook/addon-docs";
import { action } from "@storybook/addon-actions";
import { Search } from "../../components/search";
import { responses } from "./responses";

export default {
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
const inputDelay = process.env.NODE_ENV === "test" ? 0 : 100;

function Template(args) {
  return <Search {...args} />;
}

Template.args = {
  open: true,
};

export const Default = {
  ...Template,
  args: {
    ...Template.args,
    onQueryChange: async (query) => {
      action("onQueryChange")(query);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([responses.resolved[0]]);
        }, delay);
      });
    },
  },
};

export const SearchInProgress = {
  ...Template,
  args: {
    ...Template.args,
    onQueryChange: async (query) => {
      action("onQueryChange")(query);

      return new Promise(() => {});
    },
  },
  play: async ({ searchQuery = "ipsum" }) => {
    const searchDialog = await screen.findByRole("searchbox");

    await userEvent.type(searchDialog, searchQuery, { delay: inputDelay });
  },
};

export const SingleResultFound = {
  ...Default,
  play: SearchInProgress.play,
};

export const MultipleResultsFound = {
  ...SingleResultFound,
  args: {
    ...SingleResultFound.args,
    onQueryChange: async (query) => {
      action("onQueryChange")(query);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(responses.resolved);
        }, delay);
      });
    },
  },
};

export const NoResultsFound = {
  ...SingleResultFound,
  args: {
    ...SingleResultFound.args,
    onQueryChange: async (query) => {
      action("onQueryChange")(query);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, delay);
      });
    },
  },
};

export const Error = {
  ...SingleResultFound,
  args: {
    ...SingleResultFound.args,
    onQueryChange: async (query) => {
      action("onQueryChange")(query);

      return new Promise((_, reject) => {
        setTimeout(() => {
          reject({ message: "There was an error" });
        }, delay);
      });
    },
  },
};
