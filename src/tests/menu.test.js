import React from "react";
import { render, screen, within } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/menu/menu.stories";
import userEvent from "@testing-library/user-event";

const {
  LoadedDefault,
  LoadedInitialCollapsed,
  LoadedNotCollapsible,
} = composeStories(stories);

describe("Menu", () => {
  test("in a default state, it renders correctly", () => {
    render(<LoadedDefault />);

    const menu = screen.getByRole("navigation");

    // It correctly renders the toggle button
    expect(
      within(menu).getByRole("button", { name: /collapse menu/i })
    ).not.toBeDisabled();

    // It renders all links
    LoadedDefault.args.menuItems.forEach(({ label, url }) => {
      const link = within(menu).getByRole("link", { name: label });

      expect(link).toHaveAttribute("href", url);
    });
  });

  test("when set to initial collapsed, it renders correctly", () => {
    render(<LoadedInitialCollapsed />);

    const menu = screen.getByRole("navigation");

    // It correctly renders the toggle button
    expect(
      within(menu).getByRole("button", { name: /expand menu/i })
    ).not.toBeDisabled();

    // It does not render any links
    expect(within(menu).queryAllByRole("link")).toHaveLength(0);
  });

  test("when set to not collapsible, it renders correctly", () => {
    render(<LoadedNotCollapsible />);

    const menu = screen.getByRole("navigation");

    // It does not render a toggle button
    expect(within(menu).queryByRole("button")).toBeNull();

    // It renders all links
    LoadedDefault.args.menuItems.forEach(({ label, url }) => {
      const link = within(menu).getByRole("link", { name: label });

      expect(link).toHaveAttribute("href", url);
    });
  });

  test("the header level of the menu title can be customised", () => {
    render(<LoadedDefault menuTitleElement="h1" />);

    const menu = screen.getByRole("navigation");

    // It renders the menu title using the passed heading level
    expect(
      within(menu).getByRole("heading", {
        name: LoadedDefault.args.menuTitle,
        level: 1,
      })
    ).toBeInTheDocument();
  });

  test("a user can toggle a items in a collapsible menu", () => {
    render(<LoadedDefault />);

    const menu = screen.getByRole("navigation");

    // It renders the navigation links
    expect(within(menu).getAllByRole("link")).toHaveLength(
      LoadedDefault.args.menuItems.length
    );

    // On click of the collapse menu button
    userEvent.click(
      within(menu).getByRole("button", { name: /collapse menu/i })
    );

    // The toggle button label changes
    expect(
      within(menu).queryByRole("button", { name: /collapse menu/i })
    ).toBeNull();

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
    ).toBeNull();

    expect(
      within(menu).getByRole("button", { name: /collapse menu/i })
    ).toBeInTheDocument();

    // It renders the navigation links
    expect(within(menu).getAllByRole("link")).toHaveLength(
      LoadedDefault.args.menuItems.length
    );
  });

  test("it should spread other props to the component root DOM node", () => {
    const className = "test-class-name";

    render(<LoadedDefault className={className} />);

    const menu = screen.getByRole("navigation");

    expect(menu).toHaveClass(className);
  });
});
