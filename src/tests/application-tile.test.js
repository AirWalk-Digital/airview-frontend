import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/application-tile/application-tile.stories";
import userEvent from "@testing-library/user-event";

const { WithDataExpanded } = composeStories(stories);

describe("ApplicationTile", () => {
  test("a user can toggle the expansion of collapsed content", async () => {
    const { container } = render(<WithDataExpanded />);

    await WithDataExpanded.play({ canvasElement: container });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 4, name: /production/i })
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button", { name: /collapse content/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { level: 4, name: /production/i })
      ).not.toBeInTheDocument();
    });
  });
});
