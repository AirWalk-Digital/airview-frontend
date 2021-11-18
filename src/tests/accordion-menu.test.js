import React from "react";
import {
  render,
  screen,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/accordion-menu/accordion-menu.stories";

const { Loading, LoadedWithTitle } = composeStories(stories);

describe("AccordionMenu", () => {
  test("in a loading state, it renders correctly", () => {
    render(<Loading />);

    const navigation = screen.getByRole("navigation", {
      name: Loading.args.menuTitle,
    });

    // It should have required accessibility attributes
    expect(navigation).toHaveAttribute("aria-live", "polite");
    expect(navigation).toHaveAttribute("aria-busy", "true");

    // It should not output any navigation links
    expect(within(navigation).queryAllByRole("link")).toHaveLength(0);
  });

  test("in a loaded state, it renders correctly", () => {
    render(<LoadedWithTitle />);

    const navigation = screen.getByRole("navigation", {
      name: Loading.args.menuTitle,
    });

    // It should have required accessibility attributes
    expect(navigation).toHaveAttribute("aria-live", "polite");
    expect(navigation).toHaveAttribute("aria-busy", "false");

    // It should initially render the top level navigation nodes by default
    const topLevelNavItems = LoadedWithTitle.args.navItems.filter(
      ({ children }) => !children
    );

    const topLevelLinks = within(navigation).queryAllByRole("link");

    expect(topLevelLinks.length).toBe(topLevelNavItems.length);

    topLevelLinks.forEach((link, index) => {
      expect(link).toHaveTextContent(topLevelNavItems[index].name);
      expect(link).toHaveAttribute("href", topLevelNavItems[index].url);
    });

    // It should initially render the top level parents by default
    const topLevelParentNavItems = LoadedWithTitle.args.navItems.filter(
      ({ children }) => children
    );

    const topLevelParents = within(navigation).queryAllByRole("button");

    expect(topLevelParents.length).toBe(topLevelParentNavItems.length);

    topLevelParents.forEach((parent, index) => {
      expect(parent).toHaveTextContent(topLevelParentNavItems[index].name);
    });
  });

  test("a user can toggle visibility of nested child links", async () => {
    render(<LoadedWithTitle />);

    const navigation = screen.getByRole("navigation", {
      name: Loading.args.menuTitle,
    });

    const topLevelNavParent = LoadedWithTitle.args.navItems
      .filter(({ children }) => children)
      .shift();

    // Click on the parent naviagtion node to reveal sub level links
    userEvent.click(
      within(navigation).getByRole("button", {
        name: topLevelNavParent.name,
      })
    );

    const subNavigationLinks = topLevelNavParent.children.filter(
      ({ children }) => !children
    );

    // It should render sub level links
    subNavigationLinks.forEach(({ name, url }) => {
      const linkItem = screen.getByRole("link", { name });

      expect(linkItem).toBeInTheDocument();
      expect(linkItem).toHaveAttribute("href", url);
    });

    // Click on the parent naviagtion node to hide sub level links
    userEvent.click(
      within(navigation).getByRole("button", {
        name: topLevelNavParent.name,
      })
    );

    // It should remove all sub level links
    await Promise.all(
      subNavigationLinks.map(async ({ name }) => {
        await waitForElementToBeRemoved(() =>
          screen.queryByRole("link", { name })
        );
      })
    );
  });
});
