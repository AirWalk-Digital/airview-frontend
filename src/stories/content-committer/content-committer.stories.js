import React from "react";
import { screen, userEvent, within } from "@storybook/testing-library";
import { action } from "@storybook/addon-actions";
import { ContentCommitter } from "../../components/preview-mode-controller";

export default {
  title: "Modules/Preview Mode Controller/Widgets/Content Committer",
  component: ContentCommitter,
  parameters: {
    layout: "centered",
  },
};

const callbackDelay = process.env.NODE_ENV === "test" ? 0 : 1000;
const inputDelay = process.env.NODE_ENV === "test" ? 0 : 100;

function Template(args) {
  return <ContentCommitter {...args} />;
}

Template.args = {
  disabled: false,
  onSubmit: async () => {
    action("onSubmit")();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, callbackDelay);
    });
  },
};

export const ClosedDisabled = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true,
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
      canvas.getByRole("button", { name: /commit changes/i })
    );
  },
};

export const WithValidFormData = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /commit changes/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/commit message/i),
      "Test commit message",
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
      name: /commit changes/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/commit message/i),
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula"
    );
  },
};

export const Submitting = {
  ...Template,
  args: {
    ...Template.args,
    onSubmit: async () => {
      action("onSubmit")();
      return new Promise(() => {});
    },
  },
  play: async (context) => {
    await WithValidFormData.play(context);

    const dialog = screen.getByRole("dialog", {
      name: /commit changes/i,
    });

    await userEvent.click(
      within(dialog).getByRole("button", { name: /commit/i })
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
    onSubmit: async () => {
      action("onSubmit")();

      return new Promise((_, reject) => {
        setTimeout(() => {
          reject({
            error: "Error: Unable to commit changes, please try again",
          });
        }, callbackDelay);
      });
    },
  },
  play: async (context) => {
    await Submitting.play(context);
  },
};
