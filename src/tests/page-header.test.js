import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent, { specialChars } from "@testing-library/user-event";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/page-header/page-header.stories";
import { responses } from "../stories/search/responses";

const { PreviewDisabled, Loading } = composeStories(stories);

describe("PageHeader", () => {
  test("a user can toggle the visibility of the main drawer", async () => {
    render(<PreviewDisabled />);

    // Open the app drawer
    userEvent.click(
      screen.getByRole("button", {
        name: /open navigation menu/i,
      })
    );

    // It presents the site title
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: PreviewDisabled.args.siteTitle })
      ).toBeInTheDocument();
    });

    // Close the app drawer
    userEvent.click(screen.getByRole("presentation").firstChild);

    // It removes the site title from view
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: PreviewDisabled.args.siteTitle,
        })
      ).not.toBeInTheDocument();
    });
  });

  test("a user can toggle the visibility of the search UI", async () => {
    render(<PreviewDisabled />);

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();

    const openSearchButton = screen.getByRole("button", {
      name: /search/i,
    });

    userEvent.click(openSearchButton);

    // It should open the search UI on click of the search button
    await waitFor(() => {
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button", { name: /close/i }));

    // It should close the search UI on click of the close search button
    await waitFor(() => {
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    userEvent.type(document.querySelector("body"), "/", {
      skipClick: true,
    });

    // It should open the search UI on press of the correct keystroke
    await waitFor(() => {
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("presentation").firstChild);

    // It should close the search UI on click of the search UI modal background
    await waitFor(() => {
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    userEvent.click(openSearchButton);

    await waitFor(() => {
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    userEvent.type(document.querySelector("body"), `${specialChars.escape}`, {
      skipClick: true,
    });

    // It should the search UI on press of the escape key
    await waitFor(() => {
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });
  });

  test("in a loading state, a user can not reveal the search UI", async () => {
    render(<Loading />);

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /search/i,
      })
    ).toBeDisabled();

    userEvent.type(document.querySelector("body"), "/", {
      skipClick: true,
    });

    await waitFor(() => {
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });
  });

  test("when a user closes an open Search component, it resets the search UI to an initial state", async () => {
    render(<PreviewDisabled />);

    const revealSearchButton = screen.getByRole("button", {
      name: /search/i,
    });

    userEvent.click(revealSearchButton);

    // Enter a search query
    userEvent.type(screen.getByRole("searchbox"), "test");

    // Await for results
    await waitFor(() => {
      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    // Close search UI
    userEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    // Re-open the search UI
    userEvent.click(revealSearchButton);

    const searchDialog = screen.queryByRole("dialog");

    // Search input should be set to an empty value
    expect(screen.getByRole("searchbox")).not.toHaveValue();
    expect(screen.getByRole("searchbox")).not.toHaveDisplayValue();

    // The loading indicator should not be present
    expect(
      within(searchDialog).queryByRole("progressbar")
    ).not.toBeInTheDocument();

    // It does not display a clear query button
    expect(
      within(searchDialog).queryByRole("button", { name: /clear query/i })
    ).not.toBeInTheDocument();

    // It does not display any results
    expect(within(searchDialog).queryAllByRole("link")).toHaveLength(0);
  });

  test("when a user toggles the visibility of the Search component whilst a request is pending, the output of the request response is not rendered when re-opended", async () => {
    const onQueryChangeSpy = jest.spyOn(PreviewDisabled.args, "onQueryChange");

    onQueryChangeSpy.mockResolvedValue(responses.resolved[0]);

    render(<PreviewDisabled />);

    const revealSearchButton = screen.getByRole("button", {
      name: /search/i,
    });

    // Reveal search UI
    userEvent.click(revealSearchButton);

    const searchDialog = screen.queryByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // Enter a search query
    userEvent.type(searchInput, "test");

    // Close search UI
    userEvent.click(
      within(searchDialog).getByRole("button", { name: /close/i })
    );

    await waitFor(() => {
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    // Re-open the search UI
    userEvent.click(revealSearchButton);

    await waitFor(() => expect(onQueryChangeSpy).toHaveBeenCalled());

    // It should not present any results to the user
    await waitFor(() => {
      expect(
        within(screen.getByRole("dialog")).queryAllByRole("link")
      ).toHaveLength(0);
    });

    onQueryChangeSpy.mockRestore();
  });
});
