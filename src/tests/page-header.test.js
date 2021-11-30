import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent, { specialChars } from "@testing-library/user-event";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/page-header/page-header.stories";
import { responses } from "../stories/search/responses";

const { PreviewDisabled } = composeStories(stories);

describe("PageHeader", () => {
  test("the initial render is correct", async () => {
    render(<PreviewDisabled />);

    // It should not reveal the main drawer contents
    expect(
      screen.queryByRole("navigation", { name: /main navigation/i })
    ).not.toBeInTheDocument();

    // It should not reveal the search UI
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  test("a user can toggle the visibility of the app drawer contents", async () => {
    render(<PreviewDisabled />);

    // Open the app drawer
    userEvent.click(
      screen.getByRole("button", {
        name: /open navigation menu/i,
      })
    );

    // It presents the main drawer contents
    await waitFor(() => {
      expect(
        screen.getByRole("navigation", {
          name: /main navigation/i,
        })
      ).toBeInTheDocument();
    });

    // Closing the app drawer
    userEvent.click(screen.getByRole("presentation").firstChild);

    // It removes the main navigation from view
    await waitFor(() => {
      expect(
        screen.queryByRole("navigation", { name: /main navigation/i })
      ).not.toBeInTheDocument();
    });
  });

  test("a user can close an open search UI using the close button", async () => {
    render(<PreviewDisabled />);

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();

    const openSearchButton = screen.getByRole("button", { name: /search/i });

    userEvent.click(openSearchButton);

    await waitFor(() => {
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });
  });

  test("a user can close an open search by clicking on the backdrop", async () => {
    render(<PreviewDisabled />);

    const openSearchButton = screen.getByRole("button", { name: /search/i });

    userEvent.click(openSearchButton);

    await waitFor(() => {
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("presentation").firstChild);

    await waitFor(() => {
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });
  });

  test("a user can close an open search by pressing the escape key", async () => {
    render(<PreviewDisabled />);

    const openSearchButton = screen.getByRole("button", { name: /search/i });

    userEvent.click(openSearchButton);

    await waitFor(() => {
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    userEvent.type(document.querySelector("body"), `${specialChars.escape}`, {
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
