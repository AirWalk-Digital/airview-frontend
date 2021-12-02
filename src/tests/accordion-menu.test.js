import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/accordion-menu/accordion-menu.stories";
import userEvent from "@testing-library/user-event";

const { Loaded } = composeStories(stories);

describe("AccordionMenu", () => {
  test("a user can toggle the expansion of nested child links", async () => {
    render(<Loaded />);

    const parentLinkButton = screen.getByRole("button", {
      name: Loaded.args.navItems[1].name,
    });

    userEvent.click(parentLinkButton);

    await waitFor(() => expect(screen.getAllByRole("link")).toHaveLength(7));

    userEvent.click(parentLinkButton);

    await waitFor(() => expect(screen.getAllByRole("link")).toHaveLength(3));
  });
});
