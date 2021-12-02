import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/accordion-menu/accordion-menu.stories";
import userEvent from "@testing-library/user-event";

const { Loading, Loaded } = composeStories(stories);

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
    expect(navigation).toHaveAttribute("aria-busy", "true");

    // It does not render menu title
    expect(within(navigation).getByRole("heading").textContent).toBe("");

    // It should not output any navigation links
    expect(within(navigation).queryAllByRole("link")).toHaveLength(0);
  });

  test("in a loaded state, it renders correctly", () => {
    render(<Loaded />);

    const navigation = screen.getByRole("navigation", {
      name: Loaded.args.menuTitle,
    });

    // It should have required accessibility attributes
    expect(navigation).toHaveAttribute("aria-busy", "false");

    // It renders the menu title
    expect(
      within(navigation).getByRole("heading", {
        name: Loaded.args.menuTitle,
      })
    ).toBeInTheDocument();

    // It should initially only render the top level navigation nodes by default
    const links = within(navigation).getAllByRole("link");

    expect(links.length).toBe(3);

    // It should apply the correct label to the link
    expect(links[0]).toHaveTextContent(Loaded.args.navItems[0].name);
    expect(links[0]).toHaveAttribute("href", Loaded.args.navItems[0].url);

    // It should apply the correct label to the top level parent
    expect(within(navigation).getByRole("button")).toHaveTextContent(
      Loaded.args.navItems[1].name
    );
  });

  test("a user can toggle expand nested child links", async () => {
    render(<Loaded />);

    const parentLinkButton = screen.getByRole("button", {
      name: Loaded.args.navItems[1].name,
    });

    userEvent.click(parentLinkButton);

    await waitFor(() => expect(screen.getAllByRole("link")).toHaveLength(7));

    userEvent.click(parentLinkButton);

    await waitFor(() => expect(screen.getAllByRole("link")).toHaveLength(3));
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
