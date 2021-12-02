import React from "react";
import { render, screen, within } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/menu/menu.stories";
import userEvent from "@testing-library/user-event";

const {
  LoadingDefault,
  LoadingInitialCollapsed,
  LoadingNotCollapsible,
  LoadedDefault,
  LoadedInitialCollapsed,
  LoadedNotCollapsible,
} = composeStories(stories);

describe("Menu", () => {
  test("in a default loading state, it renders correctly", () => {
    render(<LoadingDefault />);

    const menu = screen.getByRole("navigation");

    // It should have required accessibility attributes
    expect(menu).toHaveAttribute("aria-busy", "true");

    // It does not render menu title to the user
    expect(
      within(menu).queryByRole("heading", {
        name: LoadingDefault.args.menuTitle,
      })
    ).not.toBeInTheDocument();

    // It renders a loading skeleton title
    expect(within(menu).getByRole("heading", { level: 6 })).toBeInTheDocument();

    // It does not render any link items
    expect(within(menu).queryAllByRole("link")).toHaveLength(0);

    // It renders a list of loading skeleton link items
    expect(within(menu).getByRole("list")).toBeVisible();

    // It sets the menu toggle button to disabled
    expect(
      within(menu).getByRole("button", { name: /collapse menu/i })
    ).toBeDisabled();
  });

  test("in a loading state, set to initial collapsed, it renders correctly", () => {
    render(<LoadingInitialCollapsed />);

    const menu = screen.getByRole("navigation");

    // It does not render a list of loading skeleton link items
    expect(within(menu).queryByRole("list")).toBeNull();

    // It correctly renders the toggle button
    const menuToggleButton = within(menu).getByRole("button", {
      name: /expand menu/i,
    });

    expect(menuToggleButton).toBeInTheDocument();
  });

  test("in a loading state, set to not collapsible, it renders correctly", () => {
    render(<LoadingNotCollapsible />);

    const menu = screen.getByRole("navigation");

    // It renders a list of loading skeleton link items
    expect(within(menu).getByRole("list")).toBeVisible();

    // It does not render a menu toggle button
    expect(within(menu).queryByRole("button")).not.toBeInTheDocument();
  });

  test("in a default loaded state, it renders correctly", () => {
    render(<LoadedDefault />);

    const menu = screen.getByRole("navigation");

    // It should have required accessibility attributes
    expect(menu).toHaveAttribute("aria-busy", "false");

    // It renders a menu title to the user
    expect(
      within(menu).queryByRole("heading", {
        level: 6,
        name: LoadedDefault.args.menuTitle,
      })
    ).toBeInTheDocument();

    const links = within(menu).getAllByRole("link");

    // It renders all links
    expect(links).toHaveLength(3);

    // It applies the correct link label
    expect(links[0]).toHaveTextContent(LoadedDefault.args.menuItems[0].label);

    // It applies the correct link url
    expect(links[0]).toHaveAttribute(
      "href",
      LoadedDefault.args.menuItems[0].url
    );

    // It correctly renders the toggle button
    expect(
      within(menu).getByRole("button", { name: /collapse menu/i })
    ).not.toBeDisabled();
  });

  test("in a loaded state, set to initial collapsed, it renders correctly", () => {
    render(<LoadedInitialCollapsed />);

    const menu = screen.getByRole("navigation");

    // It does not render any links
    expect(within(menu).queryAllByRole("link")).toHaveLength(0);

    // It correctly renders the toggle button
    expect(
      within(menu).getByRole("button", { name: /expand menu/i })
    ).not.toBeDisabled();
  });

  test("in a loaded state, set to not collapsible, it renders correctly", () => {
    render(<LoadedNotCollapsible />);

    const menu = screen.getByRole("navigation");

    const links = within(menu).getAllByRole("link");

    // It renders all links
    expect(links).toHaveLength(3);

    // It does not render a toggle button
    expect(within(menu).queryByRole("button")).not.toBeInTheDocument();
  });

  test("the header level of the menu title can be customised", () => {
    render(<LoadedDefault menuTitleElement="h1" />);

    const menu = screen.getByRole("navigation");

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

  test("it should spread other props to the component root DOM node", () => {
    const className = "test-class-name";

    render(<LoadedDefault className={className} />);

    const menu = screen.getByRole("navigation");

    expect(menu).toHaveClass(className);
  });
});
