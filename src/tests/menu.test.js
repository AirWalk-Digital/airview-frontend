import React from "react";
import { render, screen, within } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/menu/menu.stories";
import userEvent from "@testing-library/user-event";

const { LoadedDefault } = composeStories(stories);

describe("Menu", () => {
  test("a user can toggle the visibility of items in a collapsible menu", () => {
    render(<LoadedDefault />);

    const menu = screen.getByRole("navigation");

    // It renders the navigation links
    expect(within(menu).getAllByRole("link")).toHaveLength(3);

    // On click of the collapse menu button
    userEvent.click(
      within(menu).getByRole("button", { name: /collapse menu/i })
    );

    // The toggle button label changes
    expect(
      within(menu).queryByRole("button", { name: /collapse menu/i })
    ).not.toBeInTheDocument();

    expect(
      within(menu).getByRole("button", { name: /expand menu/i })
    ).toBeInTheDocument();

    // It does not render the navigation links
    expect(within(menu).queryAllByRole("link")).toHaveLength(0);

    // On click of the expand menu button
    userEvent.click(within(menu).getByRole("button", { name: /expand menu/i }));

    // The toggle button label changes
    expect(
      within(menu).queryByRole("button", { name: /expand menu/i })
    ).not.toBeInTheDocument();

    expect(
      within(menu).getByRole("button", { name: /collapse menu/i })
    ).toBeInTheDocument();

    // It renders the navigation links
    expect(within(menu).getAllByRole("link")).toHaveLength(3);
  });
});
