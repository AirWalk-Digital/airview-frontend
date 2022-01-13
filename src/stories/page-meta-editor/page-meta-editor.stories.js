import React from "react";
import { screen, userEvent, within } from "@storybook/testing-library";
import { action } from "@storybook/addon-actions";
import { PageMetaEditor } from "../../components/preview-mode-controller";
import dayjs from "dayjs";

export default {
  title: "Modules/Preview Mode Controller/Widgets/Page Meta Editor",
  component: PageMetaEditor,
  parameters: {
    layout: "centered",
  },
};

const callbackDelay = process.env.NODE_ENV === "test" ? 0 : 1000;
const inputDelay = process.env.NODE_ENV === "test" ? 0 : 100;

function Template(args) {
  return <PageMetaEditor {...args} />;
}

Template.args = {
  disabled: false,
  initialData: {
    title: "Test Page Title",
    reviewDate: dayjs().toISOString(),
    userFacing: false,
  },
  onSubmit: async (formData) => {
    action("onSubmit")(formData);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, callbackDelay);
    });
  },
};

export const CloseDisabled = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true,
  },
};

export const ClosedNotDisabled = {
  ...Template,
};

export const InitialOpen = {
  ...Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: /edit page/i }));
  },
};

export const WithValidFormData = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /edit page/i,
    });

    const titleInput = await within(dialog).findByLabelText(/title/i);

    await userEvent.clear(titleInput);

    await userEvent.type(titleInput, "Test Page Title Amended", {
      delay: inputDelay,
    });

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
      name: /edit page/i,
    });

    const titleInput = await within(dialog).findByLabelText(/title/i);

    await userEvent.clear(titleInput);

    await userEvent.type(titleInput, "Test Page Title Amended*", {
      delay: inputDelay,
    });

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
      name: /edit page/i,
    });

    await userEvent.click(
      within(dialog).getByRole("button", { name: /save/i })
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
              "Error: Unable to submit page meta changes, please try again",
          });
        }, callbackDelay);
      });
    },
  },
  play: async (context) => {
    await Submitting.play(context);
  },
};
