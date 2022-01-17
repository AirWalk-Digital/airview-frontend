import React from "react";
import { screen, userEvent, within } from "@storybook/testing-library";
import { action } from "@storybook/addon-actions";
import { ApplicationCreator } from "../../components/preview-mode-controller";

export default {
  title: "Modules/Preview Mode Controller/Widgets/Application Creator",
  component: ApplicationCreator,
  parameters: {
    layout: "centered",
  },
};

const callbackDelay = process.env.NODE_ENV === "test" ? 0 : 1000;
const inputDelay = process.env.NODE_ENV === "test" ? 0 : 100;

function Template(args) {
  return <ApplicationCreator {...args} />;
}

Template.args = {
  applications: [
    {
      name: "Application One",
      id: 1,
    },
    {
      name: "Application Two",
      id: 2,
    },
  ],
  applicationTypes: [
    {
      name: "Application Type One",
      id: "ONE",
    },
    {
      name: "Application Type Two",
      id: "TWO",
    },
    {
      name: "Application Type Three",
      id: "THREE",
    },
  ],
  environments: [
    {
      name: "Environment One",
      id: 1,
    },
    {
      name: "Environment Two",
      id: 2,
    },
  ],
  referenceTypes: ["Reference Type One", " Reference Type Two"],
  onSubmit: async (formData) => {
    action("onSubmit")(formData);

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
      canvas.getByRole("button", { name: /create new application/i })
    );
  },
};

export const WithValidFormData = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /create new application/i,
    });

    await userEvent.click(within(dialog).getByLabelText(/parent application/i));

    await userEvent.click(
      within(
        screen.getByRole("listbox", { name: /parent application/i })
      ).getByRole("option", { name: /application one/i })
    );

    await userEvent.type(
      within(dialog).getByLabelText(/application name/i),
      "Test application name",
      {
        delay: inputDelay,
      }
    );

    await userEvent.click(within(dialog).getByLabelText(/application type/i));

    await userEvent.click(
      within(
        screen.getByRole("listbox", { name: /application type/i })
      ).getByRole("option", { name: /application type one/i })
    );

    await userEvent.click(within(dialog).getByLabelText(/environment/i));

    await userEvent.click(
      within(
        screen.getByRole("listbox", { name: /environment/i })
      ).getByRole("option", { name: /environment one/i })
    );

    await userEvent.click(
      within(dialog).getByRole("button", { name: /add reference/i })
    );

    const referencesInput = await within(dialog).findByRole("group", {
      name: /references/i,
    });

    await userEvent.click(within(referencesInput).getByLabelText(/type/i));

    await userEvent.click(
      within(screen.getByRole("listbox", { name: /type/i })).getByRole(
        "option",
        { name: /reference type one/i }
      )
    );

    await userEvent.type(
      within(referencesInput).getByLabelText(/reference label/i),
      "Test reference label",
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
    onSubmit: async (formData) => {
      action("onSubmit")(formData);
      return new Promise(() => {});
    },
  },
  play: async (context) => {
    await WithValidFormData.play(context);

    const dialog = screen.getByRole("dialog", {
      name: /create new application/i,
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
            error: "Error: Unable to create application, please try again",
          });
        }, callbackDelay);
      });
    },
  },
  play: async (context) => {
    await Submitting.play(context);
  },
};
