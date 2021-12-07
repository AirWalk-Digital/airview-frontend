import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/accordion-menu/accordion-menu.stories";
import userEvent from "@testing-library/user-event";

const { Loading, Loaded, LoadedExpanded } = composeStories(stories);

describe("AccordionMenu", () => {
  test("in a loading state, it renders correctly", () => {
    render(<Loading />);

    const navigation = screen.getByRole("navigation");

    // It adds the correct loading accessibility attribute
    expect(navigation).toHaveAttribute("aria-busy", "true");

    // It renders no title
    expect(screen.getByRole("heading")).toHaveTextContent("");

    // It renders no links
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  test("in a default loaded state, it renders correctly", () => {
    render(<Loaded />);

    const navigation = screen.getByRole("navigation");

    // It adds the correct loading accessibility attribute
    expect(navigation).toHaveAttribute("aria-busy", "false");

    // It renders the title
    expect(
      screen.getByRole("heading", { name: /menu title/i })
    ).toBeInTheDocument();

    const links = screen.getAllByRole("link");

    // It renders top level links
    expect(links).toHaveLength(3);

    // It applies the correct label and url to the link items
    expect(links[0]).toHaveTextContent(/navigation item 1/i);
    expect(links[0]).toHaveAttribute("href", "/");
  });

  test("a user can toggle the expansion of nested child links", async () => {
    const { container } = render(<LoadedExpanded />);

    LoadedExpanded.play({ canvasElement: container });

    // It renders all child links
    await waitFor(() => expect(screen.getAllByRole("link")).toHaveLength(7));

    // Close top level link parent
    userEvent.click(
      screen.getByRole("button", {
        name: /navigation item 2 - parent/i,
      })
    );

    // It only renders top level link items
    await waitFor(() => expect(screen.getAllByRole("link")).toHaveLength(3));
  });

  test("it spreads rest props to the root node", () => {
    const testId = "test-id";

    render(<Loading data-testid={testId} />);

    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-testid",
      testId
    );
  });
});
