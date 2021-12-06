import React from "react";
import { screen, userEvent, within } from "@storybook/testing-library";
import { action } from "@storybook/addon-actions";
//import { PreviewModeControllerContext } from "../../components/preview-mode-controller/preview-mode-controller-context";
import * as branchSwitcherStories from "../branch-switcher/branch-switcher.stories";
import { BranchCreator } from "../../components/preview-mode-controller";

export default {
  title: "Modules/Preview Mode Controller/Branch Creator",
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

export const WithInvalidBranchName = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /create branch/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/branch name/i),
      "invalid-branch-name*",
      {
        delay: inputDelay,
      }
    );
  },
};

export const WithSuccess = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /create branch/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/branch name/i),
      "test-branch",
      {
        delay: inputDelay,
      }
    );

    await userEvent.click(
      within(dialog).getByRole("button", { name: /create/i })
    );
  },
};

export const WithError = {
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
    await WithSuccess.play(context);
  },
};
