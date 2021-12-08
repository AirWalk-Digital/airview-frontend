import React from "react";
import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/preview-mode-controller/preview-mode-controller.stories";
import userEvent from "@testing-library/user-event";

const { Loading, Inactive, Active } = composeStories(stories);

describe("PreviewModeController", () => {
  test("in a loading state, it renders correctly", () => {
    render(<Loading />);

    // It does not render the toggle button or widget buttons
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  test("in a loaded inactive state, it renders correctly", () => {
    render(<Inactive />);

    const buttons = screen.getAllByRole("button");

    // It only renders the enable preview button, no widget buttons
    expect(buttons).toHaveLength(1);
  });

  test("a user can make a request to enable preview mode", () => {
    const onToggleMock = jest.fn();

    render(<Inactive onToggle={onToggleMock} />);

    userEvent.click(screen.getByRole("button", { name: /enable preview/i }));

    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });

  test("in a loaded active state, it renders correctly", () => {
    render(<Active />);

    // It renders the disable preview button and widget buttons
    expect(screen.getAllByRole("button")).toHaveLength(9);

    // It outputs the current repository name
    expect(screen.getByText(/test-org\/test-repository/i)).toBeInTheDocument();

    // It outputs the current branch name
    expect(screen.getByText(/development/i)).toBeInTheDocument();
  });

  test("a user can make a request to disable preview mode", () => {
    const onToggleMock = jest.fn();

    render(<Active onToggle={onToggleMock} />);

    userEvent.click(screen.getByRole("button", { name: /disable preview/i }));

    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });
});
