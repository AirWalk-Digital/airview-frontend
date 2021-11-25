import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationTileChip } from "../components/application-tile";

const defaultProps = {
  tooltipLabel: "Test Tooltip Label",
  icon: "Test Icon",
  label: "Test Label",
  color: "#000",
  "data-testid": "test-id",
};

function setupComponent(overrides) {
  return render(<ApplicationTileChip {...{ ...defaultProps, overrides }} />);
}

describe("ApplicationTileChip", () => {
  test("the component renders correctly", async () => {
    setupComponent();

    const chip = screen.getByTitle(defaultProps.tooltipLabel);

    // It renders the component to the DOM
    expect(chip).toBeInTheDocument();

    userEvent.hover(chip);

    // It outputs a tooltip label equal to the value passed via props when a user hovers over the chip
    await waitFor(() => {
      expect(screen.getByText(defaultProps.tooltipLabel)).toBeVisible();
    });

    // It outputs content passed to the icon prop
    expect(within(chip).getByText(defaultProps.icon)).toBeInTheDocument();

    // It outputs a label equal to the value passed via props
    expect(within(chip).getByText(defaultProps.label)).toBeInTheDocument();

    // It spreads other props to the root node
    expect(chip).toHaveAttribute("data-testid", defaultProps["data-testid"]);
  });
});
