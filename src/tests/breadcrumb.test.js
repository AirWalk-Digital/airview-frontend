import React from "react";
import { render, screen, within } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/breadcrumb/breadcrumb.stories";

const {
  Loading,
  LoadedWithoutCollapsedBreadcrumbs,
  LoadedWithCollapsedBreadcrumbs,
} = composeStories(stories);

describe("Breadcrumb", () => {
  test("in a loading state it renders correctly", () => {
    render(<Loading />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    // It should have the required accesibility attributes
    expect(breadcrumb).toHaveAttribute("aria-busy", "true");

    // It should not render any links
    expect(within(breadcrumb).queryAllByRole("link")).toHaveLength(0);

    // It should not render the reveal breadcrumbs button
    expect(
      within(breadcrumb).queryByRole("button", { name: /show path/i })
    ).not.toBeInTheDocument();
  });

  test("in a loaded state, without collapsed breadcrumbs, it renders correctly", () => {
    render(<LoadedWithoutCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    // It should have the required accesibility attributes
    expect(breadcrumb).toHaveAttribute("aria-busy", "false");

    const links = within(breadcrumb).getAllByRole("link");

    // It should render all breadcrumb links
    expect(links).toHaveLength(4);

    // It should apply the correct label to the link
    expect(links[0]).toHaveTextContent(
      LoadedWithoutCollapsedBreadcrumbs.args.links[0].label
    );

    // It should apply the correct URL to the link
    expect(links[0]).toHaveAttribute(
      "href",
      LoadedWithoutCollapsedBreadcrumbs.args.links[0].url
    );

    // It should output the current page
    expect(
      within(breadcrumb).getByText(
        LoadedWithoutCollapsedBreadcrumbs.args.activeRoute
      )
    ).toBeInTheDocument();
  });

  test("in a loaded state, with collapsed breadcrumbs, it renders correctly", () => {
    render(<LoadedWithCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    const breadcrumbLinks = within(breadcrumb).getAllByRole("link");

    // It should render a partial subset of links
    expect(breadcrumbLinks).toHaveLength(1);
  });

  test("it should spread other props to the component root DOM node", () => {
    const testId = "breadcrumb-test";
    render(<LoadedWithoutCollapsedBreadcrumbs data-testid={testId} />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    expect(breadcrumb).toHaveAttribute("data-testid", testId);
  });
});
