import React from "react";
import { render, screen, within } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/breadcrumb/breadcrumb.stories";
import userEvent from "@testing-library/user-event";

const {
  LoadingWithoutCollapsedBreadcrumbs,
  LoadingWithCollapsedBreadcrumbs,
  LoadedWithoutCollapsedBreadcrumbs,
  LoadedWithCollapsedBreadcrumbs,
} = composeStories(stories);

describe("Breadcrumb", () => {
  test("in a loading state, without colapsed breadcrumbs, it renders correctly", () => {
    render(<LoadingWithoutCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    // It should have the required accesibility attributes
    expect(breadcrumb).toHaveAttribute("aria-live", "polite");
    expect(breadcrumb).toHaveAttribute("aria-busy", "true");

    // It should not render any links
    expect(within(breadcrumb).queryAllByRole("link")).toHaveLength(0);

    // It should not render the reveal breadcrumbs button
    expect(
      within(breadcrumb).queryByRole("button", { name: /show path/i })
    ).not.toBeInTheDocument();

    // It should render the correct amount of breadcrumb item placeholders
    expect(
      within(breadcrumb).getAllByLabelText(/breadcrumb item placeholder/i)
    ).toHaveLength(5);
  });

  test("in a loading state, with colapsed breadcrumbs, it renders correctly", () => {
    render(<LoadingWithCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    // It should have the required accesibility attributes
    expect(breadcrumb).toHaveAttribute("aria-live", "polite");
    expect(breadcrumb).toHaveAttribute("aria-busy", "true");

    // It should not render any links
    expect(within(breadcrumb).queryAllByRole("link")).toHaveLength(0);

    // It should render the reveal breadcrumbs button
    expect(
      within(breadcrumb).queryByRole("button", { name: /show path/i })
    ).toBeInTheDocument();

    // It should render the correct amount of breadcrumb item placeholders
    expect(
      within(breadcrumb).getAllByLabelText(/breadcrumb item placeholder/i)
    ).toHaveLength(2);
  });

  test("in a loading state, with colapsed breadcrumbs, a user can reveal collapsed breadcrumb placeholders", () => {
    render(<LoadingWithCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", {
      name: /breadcrumb/i,
    });

    const expandBreadcrumbs = within(breadcrumb).queryByRole("button", {
      name: /show path/i,
    });

    // It should render the correct amount of breadcrumb item placeholders pre expand
    expect(
      within(breadcrumb).getAllByLabelText(/breadcrumb item placeholder/i)
    ).toHaveLength(2);

    userEvent.click(expandBreadcrumbs);

    // On click of the expand button, the button is removed
    expect(expandBreadcrumbs).not.toBeInTheDocument();

    // It should render the correct amount of breadcrumb item placeholders post expand
    expect(
      within(breadcrumb).getAllByLabelText(/breadcrumb item placeholder/i)
    ).toHaveLength(5);
  });

  test("in a loaded state, without collapsed breadcrumbs, it renders correctly", () => {
    render(<LoadedWithoutCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    // It should have the required accesibility attributes
    expect(breadcrumb).toHaveAttribute("aria-live", "polite");
    expect(breadcrumb).toHaveAttribute("aria-busy", "false");

    // It should not render any breadcrumb item placeholders
    expect(
      within(breadcrumb).queryAllByLabelText(/breadcrumb item placeholder/i)
    ).toHaveLength(0);

    // It should render all breadcrumb links with correct URLs
    LoadedWithoutCollapsedBreadcrumbs.args.links.forEach((link) => {
      const linkItem = within(breadcrumb).getByRole("link", {
        name: link.label,
      });

      expect(linkItem).toBeInTheDocument();
      expect(linkItem).toHaveAttribute("href", linkItem.url);
    });

    // It renders the current page as static text
    expect(
      within(breadcrumb).getByText(
        LoadedWithoutCollapsedBreadcrumbs.args.activeRoute
      )
    ).toBeInTheDocument();
  });

  test("in a loaded state, with collapsed breadcrumbs, it renders correctly", () => {
    render(<LoadedWithCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    // It should have the required accesibility attributes
    expect(breadcrumb).toHaveAttribute("aria-live", "polite");
    expect(breadcrumb).toHaveAttribute("aria-busy", "false");

    // It should not render any breadcrumb item placeholders
    expect(
      within(breadcrumb).queryAllByLabelText(/breadcrumb item placeholder/i)
    ).toHaveLength(0);

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

  test("in a loaded state, with collapsed breadcrumbs, a user can reveal collapsed breadcrumbs", () => {
    render(<LoadedWithCollapsedBreadcrumbs />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    const expandBreadcrumbsBtn = within(breadcrumb).queryByRole("button", {
      name: /show path/i,
    });

    // It should render the correct amount of breadcrumb links pre expand
    expect(within(breadcrumb).getAllByRole("link")).toHaveLength(1);

    // On click of expand breadbrumbs button
    userEvent.click(expandBreadcrumbsBtn);

    // It should reveal all breadcrumb links
    expect(within(breadcrumb).getAllByRole("link")).toHaveLength(
      LoadedWithCollapsedBreadcrumbs.args.links.length
    );

    // It should remove the expand breadcrumbs button
    expect(expandBreadcrumbsBtn).not.toBeInTheDocument();
  });

  test("it should spread other props to the component root DOM node", () => {
    const testId = "breadcrumb-test";
    render(<LoadingWithoutCollapsedBreadcrumbs data-testid={testId} />);

    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });

    expect(breadcrumb).toHaveAttribute("data-testid", testId);
  });
});
