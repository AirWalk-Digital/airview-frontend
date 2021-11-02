import React from "react";
import {
  render,
  screen,
  cleanup,
  within,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { composeStories } from "@storybook/testing-react";
import faker from "faker";
import * as stories from "../stories/preview-mode-controller/preview-mode-controller.stories";

const { Loading, Inactive, Active, ActiveWithErrors } = composeStories(stories);

describe("PreviewModeController", () => {
  test("a user can not interact with the component when in a loading state", () => {
    render(<Loading />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  test("no controller widgets are presented to the user when the component is in an inactive state", () => {
    render(<Inactive />);

    const buttons = screen.queryAllByRole("button");

    expect(buttons).toHaveLength(1);

    expect(
      screen.queryByRole("button", { name: /enable Preview Mode/i })
    ).toBeInTheDocument();
  });

  test("controller widgets are presented to the user when the component is in an active state", () => {
    render(<Active />);

    expect(
      screen.queryByRole("button", { name: /disable Preview Mode/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /switch working branch/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /create branch/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /create knowledge page/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /edit knowledge page meta data/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /create page section/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /create new application/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /commit changes/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /create pull request/i })
    ).toBeInTheDocument();
  });

  test("a user can enable preview mode", () => {
    const onToggleSpy = jest.spyOn(Inactive.args, "onToggle");

    render(<Inactive />);

    userEvent.click(
      screen.getByRole("button", { name: /enable preview mode/i })
    );

    expect(onToggleSpy).toHaveBeenCalled();

    onToggleSpy.mockClear();
  });

  test("a user can disable preview mode", () => {
    const onToggleSpy = jest.spyOn(Active.args, "onToggle");

    render(<Active />);

    userEvent.click(
      screen.getByRole("button", { name: /disable preview mode/i })
    );

    expect(onToggleSpy).toHaveBeenCalled();

    onToggleSpy.mockClear();
  });
});

describe("BranchSwitcher", () => {
  const setupBranchSwitcherComponent = (branch, submit = true) => {
    userEvent.click(
      screen.getByRole("button", { name: /switch working branch/i })
    );

    const dialog = screen.getByRole("dialog", {
      name: /switch working branch/i,
    });

    const selectedBranch = within(dialog).getByRole("button", {
      name: /working branch/i,
    });

    userEvent.click(selectedBranch);

    userEvent.click(
      screen.getByRole("option", {
        name: new RegExp(branch, "i"),
      })
    );

    if (submit) {
      userEvent.click(
        within(dialog).getByRole("button", { name: /change branch/i })
      );
    }
  };

  test("the component allows a user to make a request to switch branch", async () => {
    const onBranchSwitchSpy = jest.spyOn(
      Active.args.branchSwitcherArgs,
      "onSubmit"
    );

    render(<Active />);

    setupBranchSwitcherComponent(Active.args.branches[0].name);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: new RegExp(Active.args.branches[0].name, "i"),
      })
    ).toHaveAttribute("aria-disabled", "true");

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();

    expect(
      screen.getByRole("button", { name: /working, please wait.../i })
    ).toBeDisabled();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog", { name: /switch working branch/i })
    );

    expect(onBranchSwitchSpy).toHaveBeenCalledWith(
      expect.stringMatching(Active.args.branches[0].name)
    );
  });

  test("the component allows a user to cancel a branch switch request", async () => {
    render(<Active />);

    setupBranchSwitcherComponent(Active.args.branches[0].name, false);

    userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog", { name: /switch working branch/i })
    );
  });

  test.skip("the component resets the branch selector UI when the dialog is dismissed", async () => {
    render(<Active />);

    setupBranchSwitcherComponent(Active.args.branches[0].name);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog", { name: /switch working branch/i })
    );

    setupBranchSwitcherComponent(Active.args.branches[0].name, false);
  });

  test("the component handles errors correctly", async () => {
    render(<ActiveWithErrors />);

    setupBranchSwitcherComponent(ActiveWithErrors.args.branches[0].name);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    const selectedBranch = screen.getByRole("button", {
      name: new RegExp(ActiveWithErrors.args.branches[0].name, "i"),
    });

    expect(selectedBranch).toBeInTheDocument();

    expect(selectedBranch).not.toHaveAttribute("aria-disabled", "true");

    expect(screen.getByRole("button", { name: /cancel/i })).not.toBeDisabled();

    expect(
      screen.getByRole("button", { name: /change branch/i })
    ).not.toBeDisabled();

    userEvent.click(screen.getByRole("button", { name: /change branch/i }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
