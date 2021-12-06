import React from "react";
import { screen, userEvent, within } from "@storybook/testing-library";
import { action } from "@storybook/addon-actions";
import { PageSectionCreator } from "../../components/preview-mode-controller";

export default {
  title: "Modules/Preview Mode Controller/Page Section Creator ",
  component: PageSectionCreator,
  parameters: {
    layout: "centered",
  },
};

const callbackDelay = process.env.NODE_ENV === "test" ? 0 : 1000;
const inputDelay = process.env.NODE_ENV === "test" ? 0 : 100;

function Template(args) {
  return <PageSectionCreator {...args} />;
}

Template.args = {
  onSubmit: async (sectionName) => {
    action("onSubmit")(sectionName);

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
      canvas.getByRole("button", { name: /create page section/i })
    );
  },
};

export const WithValidFormData = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /create page section/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/page section name/i),
      "Test Page Section",
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
      name: /create page section/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/page section name/i),
      "Test Page Section*",
      {
        delay: inputDelay,
      }
    );
  },
};

export const WithSubmissionSuccess = {
  ...Template,
  play: async (context) => {
    await WithValidFormData.play(context);

    const dialog = screen.getByRole("dialog", {
      name: /create page section/i,
    });

    await userEvent.click(
      within(dialog).getByRole("button", { name: /create/i })
    );
  },
};

export const WithSubmissionError = {
  ...Template,
  args: {
    onSubmit: async (sectionName) => {
      action("onSubmit")(sectionName);

      return new Promise((_, reject) => {
        setTimeout(() => {
          reject({
            error: "Error: Unable to create a page section, please try again",
          });
        }, callbackDelay);
      });
    },
  },
  play: async (context) => {
    await WithValidFormData.play(context);

    const dialog = screen.getByRole("dialog", {
      name: /create page section/i,
    });

    await userEvent.click(
      within(dialog).getByRole("button", { name: /create/i })
    );
  },
};
