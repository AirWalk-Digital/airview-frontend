import React from "react";
import { screen, userEvent, within } from "@storybook/testing-library";
import { action } from "@storybook/addon-actions";
import * as branchSwitcherStories from "../branch-switcher/branch-switcher.stories";
import { BranchCreator } from "../../components/preview-mode-controller";

export default {
  title: "Modules/Preview Mode Controller/Widgets/Branch Creator",
  component: BranchCreator,
  parameters: {
    layout: "centered",
  },
  decorators: [...branchSwitcherStories.default.decorators],
};

const callbackDelay = process.env.NODE_ENV === "test" ? 0 : 1000;
const inputDelay = process.env.NODE_ENV === "test" ? 0 : 100;

function Template(args) {
  return <BranchCreator {...args} />;
}

Template.args = {
  onSubmit: async (branchName) => {
    action("onSubmit")(branchName);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, callbackDelay);
    });
  },
};

export const Closed = {
  ...Template,
};

export const InitialOpen = {
  ...Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: /create branch/i })
    );
  },
};

export const WithValidFormData = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /create branch/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/branch name/i),
      "new-feature",
      {
        delay: inputDelay,
      }
    );
  },
};

export const WithInvalidFormData = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /create branch/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/branch name/i),
      "new-feature*",
      {
        delay: inputDelay,
      }
    );
  },
};

export const Submitting = {
  ...Template,
  args: {
    ...Template.args,
    onSubmit: async (branchName) => {
      action("onSubmit")(branchName);
      return new Promise(() => {});
    },
  },
  play: async (context) => {
    await WithValidFormData.play(context);

    const dialog = screen.getByRole("dialog", {
      name: /create branch/i,
    });

    await userEvent.click(
      within(dialog).getByRole("button", { name: /create/i })
    );
  },
};

export const WithSubmissionSuccess = {
  ...Template,
  play: async (context) => {
    await Submitting.play(context);
  },
};

export const WithSubmissionError = {
  ...Template,
  args: {
    onSubmit: async (branchName) => {
      action("onSubmit")(branchName);

      return new Promise((_, reject) => {
        setTimeout(() => {
          reject({
            error: "Error: Unable to create branch, please try again",
          });
        }, callbackDelay);
      });
    },
  },
  play: async (context) => {
    await Submitting.play(context);
  },
};
