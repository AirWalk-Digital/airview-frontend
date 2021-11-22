import React from "react";
import { render, screen, within } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/breadcrumb/breadcrumb.stories";
import userEvent from "@testing-library/user-event";

const { Loading, Loaded, LoadedWithCollapsedBreadcrumbs } = composeStories(
  stories
);

describe("Breadcrumb", () => {
  test("in a loading state, it renders correctly", () => {
    render(<Loading />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    // It should have the required accesibility attributes
    expect(breadcrumb).toHaveAttribute("aria-live", "polite");
    expect(breadcrumb).toHaveAttribute("aria-busy", "true");

    // It should not render any links
    expect(within(breadcrumb).queryAllByRole("link")).toHaveLength(0);
  });

  test("in a loaded state, it renders correctly", () => {
    render(<Loaded />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    // It should have the required accesibility attributes
    expect(breadcrumb).toHaveAttribute("aria-live", "polite");
    expect(breadcrumb).toHaveAttribute("aria-busy", "false");

    // It should render all breadcrumb links with correct URLs
    Loaded.args.links.forEach((link) => {
      const linkItem = within(breadcrumb).getByRole("link", {
        name: link.label,
      });

      expect(linkItem).toBeInTheDocument();
      expect(linkItem).toHaveAttribute("href", linkItem.url);
    });

    // It renders the current page as static text
    expect(
      within(breadcrumb).getByText(Loaded.args.activeRoute)
    ).toBeInTheDocument();
  });

  test("in a collapsed state, it renders correctly", () => {
    render(<LoadedWithCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    // It should render a partial subset of links
    const breadcrumbLinks = within(breadcrumb).queryAllByRole("link");

    expect(breadcrumbLinks).toHaveLength(1);
    expect(breadcrumbLinks[0]).toHaveTextContent(
      LoadedWithCollapsedBreadcrumbs.args.links[0].label
    );

    // It renders the current page as static text
    expect(
      within(breadcrumb).getByText(
        LoadedWithCollapsedBreadcrumbs.args.activeRoute
      )
    ).toBeInTheDocument();
  });

  test("a user can reveal collapsed breadcrumbs", () => {
    render(<LoadedWithCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    userEvent.click(within(breadcrumb).getByRole("button"));

    // It should reveal all breadcrumb links
    const breadcrumbLinks = within(breadcrumb).queryAllByRole("link");

    expect(breadcrumbLinks).toHaveLength(
      LoadedWithCollapsedBreadcrumbs.args.links.length
    );
  });

  test("it should spread other props to the component root DOM node", () => {
    const testId = "breadcrumb-test";
    render(<Loaded data-testid={testId} />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    expect(breadcrumb).toHaveAttribute("data-testid", testId);
  });
});
