import React from "react";
import { screen, userEvent, within } from "@storybook/testing-library";
import { action } from "@storybook/addon-actions";
import { PreviewModeControllerContext } from "../../components/preview-mode-controller/preview-mode-controller-context";
import { BranchSwitcher } from "../../components/preview-mode-controller";

export default {
  title: "Modules/Preview Mode Controller/Branch Switcher",
  component: BranchSwitcher,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => {
      const contextMockData = {
        enabled: true,
        onToggle: () => {},
        branches: [
          {
            name: "main",
            protected: true,
          },
          {
            name: "development",
            protected: false,
          },
        ],
        workingBranch: "development",
        baseBranch: "main",
      };

      return (
        <PreviewModeControllerContext.Provider value={contextMockData}>
          {Story()}
        </PreviewModeControllerContext.Provider>
      );
    },
  ],
};

const delay = process.env.NODE_ENV === "test" ? 0 : 1000;

function Template(args) {
  return <BranchSwitcher {...args} />;
}

Template.args = {
  onSubmit: async (branchName) => {
    action("onSubmit")(branchName);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
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
      canvas.getByRole("button", { name: /switch working branch/i })
    );
  },
};

export const WithSubmissionSuccess = {
  ...Template,
  play: async (context) => {
    await InitialOpen.play(context);

    const dialog = await screen.findByRole("dialog", {
      name: /switch working branch/i,
    });

    await userEvent.click(
      within(dialog).getByRole("button", { name: /working branch/i })
    );

    const branches = await screen.findByRole("listbox", {
      name: /working branch/i,
    });

    await userEvent.click(
      within(branches).getByRole("option", { name: /main/i })
    );

    await userEvent.click(
      within(dialog).getByRole("button", { name: /change branch/i })
    );
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
            error: "Error: Unable to switch branch, please try again",
          });
        }, delay);
      });
    },
  },
  play: async (context) => {
    await WithSubmissionSuccess.play(context);
  },
};
