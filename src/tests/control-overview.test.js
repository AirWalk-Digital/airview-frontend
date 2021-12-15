import React from "react";
import {
  render,
  screen,
  within,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/control-overview/control-overview.stories";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

const { WithControls } = composeStories(stories);

async function setupComponent() {
  const controlGroupButton = await screen.findByRole("button", {
    name: /control group will resolve with controls/i,
  });

  userEvent.click(controlGroupButton);

  const controlButton = await screen.findByRole("button", {
    name: /control will resolve with resources/i,
  });

  userEvent.click(controlButton);
}

describe("ControlOverview", () => {
  beforeEach(async () => {
    render(<WithControls />);

    await setupComponent();
  });

  test("a user can sort resources by last seen date", async () => {
    const sortButton = await screen.findByRole("button", {
      name: /sort by last seen/i,
    });

    // Resources are sorted by date descending
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")[0]
    ).toHaveTextContent(/test instance 1/i);

    // Click sort button
    userEvent.click(sortButton);

    // Resources are sorted by date ascending
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")[0]
    ).toHaveTextContent(/test instance 5/i);

    // Click sort button
    userEvent.click(sortButton);

    // Resources are sorted by date descending
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")[0]
    ).toHaveTextContent(/test instance 1/i);
  });

  test("a user can filter resources", async () => {
    const filterButton = await screen.findByRole("button", {
      name: /filters/i,
    });

    // All resources rows are rendered
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")
    ).toHaveLength(5);

    // Reveal filters
    userEvent.click(filterButton);

    const productionFilter = screen.getByRole("menuitem", {
      name: /production/i,
    });

    // Click production filter
    userEvent.click(productionFilter);
    userEvent.click(screen.getByRole("presentation").firstChild);

    // Only rows that match the filter are rendered
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")
    ).toHaveLength(1);

    // Remove the filter
    userEvent.click(filterButton);
    userEvent.click(productionFilter);
    userEvent.click(screen.getByRole("presentation").firstChild);

    // All resources rows are rendered
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")
    ).toHaveLength(5);
  });

  test.todo("a user can create an exemption");

  test("a user can delete an exemption", async () => {
    const manageExemptionButton = await screen.findByRole("button", {
      name: /manage exemption/i,
    });

    // Click the manage exemption buton
    userEvent.click(manageExemptionButton);

    const manageExemptionDialog = await screen.findByRole("dialog");

    // Click the delete button
    userEvent.click(
      within(manageExemptionDialog).getByRole("button", { name: /delete/i })
    );

    await waitFor(() => expect(manageExemptionDialog).not.toBeInTheDocument());

    // To do, assert onResourceExemptionDelete was called
  });

  test("a user can save an exemption", async () => {
    const manageExemptionButton = await screen.findByRole("button", {
      name: /manage exemption/i,
    });

    // Click the manage exemption buton
    userEvent.click(manageExemptionButton);

    const manageExemptionDialog = await screen.findByRole("dialog");

    const expiresInput = within(manageExemptionDialog).getByRole("textbox");

    // Clear the current value from the expires input
    userEvent.clear(expiresInput);

    // Enter a new valid date in the expires input
    userEvent.type(
      within(manageExemptionDialog).getByRole("textbox"),
      dayjs().add(2, "day").format("DD/MM/YYYY")
    );

    // Click the save button
    userEvent.click(
      within(manageExemptionDialog).getByRole("button", { name: /save/i })
    );

    await waitFor(() => expect(manageExemptionDialog).not.toBeInTheDocument());

    // To do, assert onResourceExemptionDelete was called
  });

  test("a user can toggle the visibility of a resource supporting evidence", async () => {
    const viewEvidenceBtn = await screen.findByRole("button", {
      name: /view evidence/i,
    });

    // Click the view evidence button
    userEvent.click(viewEvidenceBtn);

    // Wait for the dialog to become visible
    const evidenceDialog = await screen.findByRole("dialog");

    // It should contain the correct content
    expect(
      within(evidenceDialog).getByText(/markdown content/i)
    ).toBeInTheDocument();

    // Click the close dialog button
    userEvent.click(within(evidenceDialog).getByRole("button"));

    // The dialog should not remain visible
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  });
});
