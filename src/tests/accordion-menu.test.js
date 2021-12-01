import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/accordion-menu/accordion-menu.stories";
import userEvent from "@testing-library/user-event";

const { Loading, LoadedDefault, LoadedWithExpandedChildren } = composeStories(
  stories
);

const getNavItems = (navItems) => {
  const output = [];

  navItems.forEach((navItem) => {
    if (navItem?.children) {
      output.push(...getNavItems(navItem.children));
    } else {
      output.push({
        name: navItem.name,
        url: navItem.url,
      });
    }
  });

  return output;
};

describe("AccordionMenu", () => {
  test("in a loading state, it renders correctly", () => {
    render(<Loading />);

    const navigation = screen.getByRole("navigation");

    // It should have required accessibility attributes
    expect(navigation).toHaveAttribute("aria-live", "polite");
    expect(navigation).toHaveAttribute("aria-busy", "true");

    // It does not render menu title
    expect(within(navigation).getByRole("heading").textContent).toBe("");

    // It renders a loading skeleton title
    expect(within(navigation).getByRole("heading")).toBeInTheDocument();

    // It should not output any navigation links
    expect(within(navigation).queryAllByRole("link")).toHaveLength(0);
  });

  test("in a default loaded state, it renders correctly", () => {
    render(<LoadedDefault />);

    const navigation = screen.getByRole("navigation", {
      name: LoadedDefault.args.menuTitle,
    });

    // It should have required accessibility attributes
    expect(navigation).toHaveAttribute("aria-live", "polite");
    expect(navigation).toHaveAttribute("aria-busy", "false");

    // It renders the menu title
    expect(
      within(navigation).getByRole("heading", {
        name: LoadedDefault.args.menuTitle,
      })
    ).toBeInTheDocument();

    // It should initially only render the top level navigation nodes by default
    const topLevelNavItems = LoadedDefault.args.navItems.filter(
      ({ children }) => !children
    );

    const topLevelLinks = within(navigation).getAllByRole("link");

    expect(topLevelLinks.length).toBe(topLevelNavItems.length);

    topLevelLinks.forEach((link, index) => {
      expect(link).toHaveTextContent(topLevelNavItems[index].name);
      expect(link).toHaveAttribute("href", topLevelNavItems[index].url);
    });

    // It should initially render the top level parents by default
    const topLevelParentNavItems = LoadedDefault.args.navItems.filter(
      ({ children }) => children
    );

    const topLevelParents = within(navigation).getAllByRole("button");

    expect(topLevelParents.length).toBe(topLevelParentNavItems.length);

    topLevelParents.forEach((parent, index) => {
      expect(parent).toHaveTextContent(topLevelParentNavItems[index].name);
    });
  });

  test("a user can expand nested child links", async () => {
    const { container } = render(<LoadedWithExpandedChildren />);

    await LoadedWithExpandedChildren.play({ canvasElement: container });

    const navItems = getNavItems(LoadedWithExpandedChildren.args.navItems);

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(navItems.length);
  });

  test("a user can collapse expanded nested child links", async () => {
    const { container } = render(<LoadedWithExpandedChildren />);

    const navItems = getNavItems(LoadedWithExpandedChildren.args.navItems);

    const topLevelNavItems = LoadedWithExpandedChildren.args.navItems.filter(
      ({ children }) => !children
    );

    await LoadedWithExpandedChildren.play({ canvasElement: container });

    await waitFor(() => {
      expect(screen.getAllByRole("link")).toHaveLength(navItems.length);
    });

    userEvent.click(
      screen.getByRole("button", {
        name: LoadedWithExpandedChildren.args.navItems[1].name,
      })
    );

    await waitFor(() => {
      expect(screen.getAllByRole("link")).toHaveLength(topLevelNavItems.length);
    });
  });

  test("it should spread other props to the component root DOM node", () => {
    const testId = "accordion-menu";
    render(<Loading data-testid={testId} />);

    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-testid",
      testId
    );
  });
});
