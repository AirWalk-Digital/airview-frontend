import React from "react";
import { screen, userEvent, within } from "@storybook/testing-library";
import { action } from "@storybook/addon-actions";
import * as branchSwitcherStories from "../branch-switcher/branch-switcher.stories";
import { PullRequestCreator } from "../../components/preview-mode-controller";

export default {
  title: "Modules/Preview Mode Controller/Pull Request Creator",
  component: PullRequestCreator,
  parameters: {
    layout: "centered",
  },
  decorators: [...branchSwitcherStories.default.decorators],
};

const callbackDelay = process.env.NODE_ENV === "test" ? 0 : 1000;

function Template(args) {
  return <PullRequestCreator {...args} />;
}

Template.args = {
  onSubmit: async (fromBranch, toBranch) => {
    action("onSubmit")(fromBranch, toBranch);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://github.com");
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
      canvas.getByRole("button", { name: /create pull request/i })
    );
  },
};

export const WithSubmissionSuccess = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /create pull request/i,
    });

    await userEvent.click(
      within(dialog).getByRole("button", { name: /create/i })
    );
  },
};

export const WithSubmissionError = {
  ...Template,
  args: {
    ...Template.args,
    onSubmit: async (fromBranch, toBranch) => {
      action("onSubmit")(fromBranch, toBranch);

      return new Promise((_, reject) => {
        setTimeout(() => {
          reject({
            error: "Error: Unable to create a pull request, please try again",
          });
        }, callbackDelay);
      });
    },
  },
  play: async (context) => {
    await WithSubmissionSuccess.play(context);
  },
};
