import React from "react";
import { render, screen, within } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/compliance-table/compliance-table.stories";
import userEvent from "@testing-library/user-event";

const { LoadedWithSingleIssue, LoadedWithMultipleIssues } = composeStories(
  stories
);

describe("ComplianceTable", () => {
  test("a user can sort rows by age", () => {
    render(<LoadedWithMultipleIssues />);

    const sortByAgeButton = screen.getByRole("button", {
      name: /sort by age/i,
    });

    // Rows are sorted descending
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")[0]
    ).toHaveTextContent("Phasellus fermentum tincidunt nisl");

    userEvent.click(sortByAgeButton);

    // Rows are sorted ascending
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")[0]
    ).toHaveTextContent(
      "Donec consectetuer ligula vulputate sem tristique cursus"
    );

    userEvent.click(sortByAgeButton);

    // Rows are sorted descending
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")[0]
    ).toHaveTextContent("Phasellus fermentum tincidunt nisl");
  });

  test("a user can filter rows", () => {
    render(<LoadedWithMultipleIssues />);

    // All table rows are presented
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")
    ).toHaveLength(5);

    const filterButton = screen.getByRole("button", { name: /show filters/i });

    userEvent.click(filterButton);

    const productionFilter = screen.getByRole("menuitem", {
      name: /production/i,
    });

    // Add a filter
    userEvent.click(productionFilter);

    userEvent.click(screen.getByRole("presentation").firstChild);

    // Only rows that match the filter are rendered
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")
    ).toHaveLength(2);

    userEvent.click(filterButton);

    // Remove a filter
    userEvent.click(productionFilter);

    userEvent.click(screen.getByRole("presentation").firstChild);

    // All table rows are presented
    expect(
      within(document.querySelector("tbody")).getAllByRole("row")
    ).toHaveLength(5);
  });

  test("a user can accept a risk", async () => {
    const onAcceptOfRisk = jest.fn();

    render(<LoadedWithSingleIssue {...{ onAcceptOfRisk }} />);

    userEvent.click(screen.getByRole("button", { name: /expand row/i }));

    userEvent.click(screen.getByRole("button", { name: /accept risk/i }));

    const dialog = await screen.findByRole("dialog");

    userEvent.type(within(dialog).getByLabelText(/summary/i), "Test");

    userEvent.type(within(dialog).getByLabelText(/mitigation/i), "Test");

    const probabilityGroup = within(dialog).getByRole("group", {
      name: /probability/i,
    });

    userEvent.click(
      within(probabilityGroup).getByRole("button", { name: /high/i })
    );

    const impactGroup = within(dialog).getByRole("group", {
      name: /impact/i,
    });

    userEvent.click(within(impactGroup).getByRole("button", { name: /high/i }));

    userEvent.click(within(dialog).getByRole("button", { name: /resources/i }));

    const resourceOptions = await screen.findByRole("listbox", {
      name: /resources/i,
    });

    userEvent.click(
      within(resourceOptions).getByRole("option", {
        name: /server instance 1/i,
      })
    );

    userEvent.click(screen.getByRole("presentation").firstChild);

    userEvent.type(within(dialog).getByLabelText(/notes/i), "Test");

    userEvent.click(within(dialog).getByRole("button", { name: /submit/i }));

    expect(onAcceptOfRisk).toHaveBeenCalledTimes(1);
  });
});
