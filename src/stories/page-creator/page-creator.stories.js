import React from "react";
import { screen, userEvent, within } from "@storybook/testing-library";
import { action } from "@storybook/addon-actions";
import { PageCreator } from "../../components/preview-mode-controller";
import dayjs from "dayjs";

export default {
  title: "Modules/Preview Mode Controller/Widgets/Page Creator",
  component: PageCreator,
  parameters: {
    layout: "centered",
  },
};

const callbackDelay = process.env.NODE_ENV === "test" ? 0 : 1000;
const inputDelay = process.env.NODE_ENV === "test" ? 0 : 100;

function Template(args) {
  return <PageCreator {...args} />;
}

Template.args = {
  onSubmit: async (formData) => {
    action("onSubmit")(formData);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, callbackDelay);
    });
  },
  pageTypes: [
    {
      name: "Knowledge",
      value: "knowledge",
      showUserFacing: true,
    },
    {
      name: "Design",
      value: "design",
      showUserFacing: false,
    },
    {
      name: "Architecture",
      value: "architecture",
      showUserFacing: false,
    },
  ],
};

export const Closed = {
  ...Template,
};

export const InitialOpen = {
  ...Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: /create page/i }));
  },
};

export const WithValidFormData = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /create page/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/title/i),
      "Test Page Title",
      {
        delay: inputDelay,
      }
    );

    const reviewDateInput = await within(dialog).findByLabelText(
      /review date/i
    );

    await userEvent.clear(reviewDateInput);

    await userEvent.type(
      reviewDateInput,
      dayjs().add(2, "day").format("DD/MM/YYYY"),
      {
        delay: inputDelay,
      }
    );

    await userEvent.click(within(dialog).getByLabelText(/user facing/i));
  },
};

export const WithInvalidFormData = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /create page/i,
    });

    await userEvent.type(
      within(dialog).getByLabelText(/title/i),
      "Test Page Title*",
      {
        delay: inputDelay,
      }
    );

    const reviewDateInput = await within(dialog).findByLabelText(
      /review date/i
    );

    await userEvent.clear(reviewDateInput);

    await userEvent.type(
      reviewDateInput,
      dayjs().subtract(2, "day").format("DD/MM/YYYY"),
      {
        delay: inputDelay,
      }
    );

    await userEvent.click(within(dialog).getByLabelText(/user facing/i));
  },
};

export const Submitting = {
  ...Template,
  args: {
    ...Template.args,
    onSubmit: async (formData) => {
      action("onSubmit")(formData);
      return new Promise(() => {});
    },
  },
  play: async (context) => {
    await WithValidFormData.play(context);

    const dialog = screen.getByRole("dialog", {
      name: /create page/i,
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
    ...Template.args,
    onSubmit: async (formData) => {
      action("onSubmit")(formData);

      return new Promise((_, reject) => {
        setTimeout(() => {
          reject({
            error:
              "Error: Unable to create a new Knowledge page, please try again",
          });
        }, callbackDelay);
      });
    },
  },
  play: async (context) => {
    await Submitting.play(context);
  },
};
