import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent, { specialChars } from "@testing-library/user-event";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/search/search.stories";
import { responses } from "../stories/search/responses";

const {
  SingleResultFound,
  MultipleResultsFound,
  NoResultsFound,
  Error,
} = composeStories(stories);

describe("Search", () => {
  test("in a closed state", () => {
    render(<MultipleResultsFound open={false} />);

    const searchDialog = screen.queryByRole("dialog");

    // It does not render the search dialog
    expect(searchDialog).not.toBeInTheDocument();
  });

  test("in a initial open state", async () => {
    render(<MultipleResultsFound />);

    const searchDialog = screen.queryByRole("dialog");

    // It renders the search dialog
    expect(searchDialog).toBeVisible();

    const searchInput = within(searchDialog).getByRole("searchbox");

    // It sets focus on the search input
    await waitFor(() => {
      expect(searchInput).toHaveFocus();
    });

    // It sets the search input value as empty
    expect(searchInput).not.toHaveValue();
    expect(searchInput).not.toHaveDisplayValue();

    // It does not display a loading indicator
    expect(
      within(searchDialog).queryByRole("progressbar")
    ).not.toBeInTheDocument();

    // It does not display a clear query button
    expect(
      within(searchDialog).queryByRole("button", { name: /clear query/i })
    ).not.toBeInTheDocument();

    // It does not display any results
    expect(within(searchDialog).queryAllByRole("link")).toHaveLength(0);

    // It does not display an error message or no results found message
    expect(
      within(searchDialog).queryByLabelText(/feedback/i)
    ).not.toBeInTheDocument();
  });

  test("with multiple results", async () => {
    const onQueryChangeSpy = jest.spyOn(
      MultipleResultsFound.args,
      "onQueryChange"
    );

    render(<MultipleResultsFound />);

    const searchQuery = "ipsum";

    const searchDialog = screen.queryByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // Setup: enter a search query
    userEvent.type(searchInput, searchQuery);

    // Searching

    // It should set the search input equal to the query value
    expect(searchInput).toHaveDisplayValue(searchQuery);
    expect(searchInput).toHaveValue(searchQuery);

    // It should present a clear search button
    await waitFor(() => {
      expect(
        within(searchDialog).getByRole("button", { name: /clear/i })
      ).toBeInTheDocument();
    });

    // It should present the search progress indicator
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).toBeInTheDocument();
    });

    // Resolved results

    // It should remove the search progress indicator
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).not.toBeInTheDocument();
    });

    // It should output each result
    expect(within(searchDialog).queryAllByRole("link")).toHaveLength(
      responses.resolved.length
    );

    within(searchDialog)
      .queryAllByRole("link")
      .forEach((link, index) => {
        expect(link).toHaveTextContent(responses.resolved[index].title);
        expect(link).toHaveTextContent(responses.resolved[index].summary);
      });

    // It should higlight the query within the results
    const marks = document.querySelectorAll("mark");

    expect(marks.length).toBe(12);

    marks.forEach((mark) => {
      expect(mark).toHaveTextContent(searchQuery);
    });

    // It should persist the query in the search input
    expect(searchInput).toHaveValue(searchQuery);
    expect(searchInput).toHaveDisplayValue(searchQuery);

    // It debounces the query change callback
    expect(onQueryChangeSpy).toHaveBeenCalledTimes(1);

    // It calls the query change callback with the argument equal to the search query
    expect(onQueryChangeSpy).toHaveBeenCalledWith(searchQuery);

    onQueryChangeSpy.mockRestore();
  });

  test("with no results", async () => {
    const onQueryChangeSpy = jest.spyOn(NoResultsFound.args, "onQueryChange");

    render(<NoResultsFound />);

    const searchQuery = "ipsum";

    const searchDialog = screen.queryByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // Setup: enter a search query
    userEvent.type(searchInput, searchQuery);

    // Searching

    // It should set the search input equal to the query value
    expect(searchInput).toHaveDisplayValue(searchQuery);
    expect(searchInput).toHaveValue(searchQuery);

    // It should present a clear search button
    await waitFor(() => {
      expect(
        within(searchDialog).getByRole("button", { name: /clear/i })
      ).toBeInTheDocument();
    });

    // It should present the search progress indicator
    await waitFor(() => {
      expect(within(searchDialog).getByRole("progressbar")).toBeInTheDocument();
    });

    // Resolved results

    // It should remove the search progress indicator
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).not.toBeInTheDocument();
    });

    // It should output a message indicating no results found
    expect(
      within(searchDialog).queryByLabelText(/feedback/i)
    ).toHaveTextContent(`No results found for "${searchQuery}`);

    // It should persist the query in the search input
    expect(searchInput).toHaveValue(searchQuery);
    expect(searchInput).toHaveDisplayValue(searchQuery);

    // It debounces the query change callback
    expect(onQueryChangeSpy).toHaveBeenCalledTimes(1);

    // It calls the query change callback with the argument equal to the search query
    expect(onQueryChangeSpy).toHaveBeenCalledWith(searchQuery);

    onQueryChangeSpy.mockRestore();
  });

  test("with an error", async () => {
    const onQueryChangeSpy = jest.spyOn(Error.args, "onQueryChange");

    render(<Error />);

    const searchQuery = "ipsum";

    const searchDialog = screen.queryByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // Setup: enter a search query
    userEvent.type(searchInput, searchQuery);

    // Searching

    // It should set the search input equal to the query value
    expect(searchInput).toHaveDisplayValue(searchQuery);
    expect(searchInput).toHaveValue(searchQuery);

    // It should present a clear search button
    await waitFor(() => {
      expect(
        within(searchDialog).getByRole("button", { name: /clear/i })
      ).toBeInTheDocument();
    });

    // It should present the search progress indicator
    await waitFor(() => {
      expect(within(searchDialog).getByRole("progressbar")).toBeInTheDocument();
    });

    // Resolved results

    // It should remove the search progress indicator
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).not.toBeInTheDocument();
    });

    // It should output an error message
    expect(
      within(searchDialog).queryByLabelText(/feedback/i)
    ).toHaveTextContent(/error/i);

    // It should persist the query in the search input
    expect(searchInput).toHaveValue(searchQuery);
    expect(searchInput).toHaveDisplayValue(searchQuery);

    // It debounces the query change callback
    expect(onQueryChangeSpy).toHaveBeenCalledTimes(1);

    // It calls the query change callback with the argument equal to the search query
    expect(onQueryChangeSpy).toHaveBeenCalledWith(searchQuery);

    onQueryChangeSpy.mockRestore();
  });

  test("a user can perform subsequent searches without having to close the component", async () => {
    render(<SingleResultFound />);

    const initialSearchQuery = "ipsum";

    const searchDialog = screen.queryByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // Setup: enter a search query
    userEvent.type(searchInput, initialSearchQuery);

    // Searching

    // It should set the search input equal to the query value
    expect(searchInput).toHaveDisplayValue(initialSearchQuery);
    expect(searchInput).toHaveValue(initialSearchQuery);

    // It should present a clear search button
    await waitFor(() => {
      expect(
        within(searchDialog).getByRole("button", { name: /clear/i })
      ).toBeInTheDocument();
    });

    // It should present the search progress indicator
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).toBeInTheDocument();
    });

    // Resolved results

    // It should remove the search progress indicator
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).not.toBeInTheDocument();
    });

    // It should output each result
    expect(within(searchDialog).queryAllByRole("link")).toHaveLength(1);

    within(searchDialog)
      .queryAllByRole("link")
      .forEach((link, index) => {
        expect(link).toHaveTextContent(responses.resolved[index].title);
        expect(link).toHaveTextContent(responses.resolved[index].summary);
      });

    const marks = document.querySelectorAll("mark");

    // It should higlight the query within the results
    expect(marks.length).toBe(2);

    marks.forEach((mark) => {
      expect(mark).toHaveTextContent(initialSearchQuery);
    });

    // It should persist the query in the search input
    expect(searchInput).toHaveValue(initialSearchQuery);
    expect(searchInput).toHaveDisplayValue(initialSearchQuery);

    // Change the query
    userEvent.type(searchInput, `${specialChars.backspace}`);

    const revisedSearchQuery = initialSearchQuery.substr(
      0,
      initialSearchQuery.length - 1
    );

    // It should set the search input equal to the query value
    expect(searchInput).toHaveDisplayValue(revisedSearchQuery);
    expect(searchInput).toHaveValue(revisedSearchQuery);

    // It should present a clear search button
    await waitFor(() => {
      expect(
        within(searchDialog).getByRole("button", { name: /clear/i })
      ).toBeInTheDocument();
    });

    // It should present the search progress indicator
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).toBeInTheDocument();
    });

    // Resolved results

    // It should remove the search progress indicator
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).not.toBeInTheDocument();
    });

    // It should output each result
    expect(within(searchDialog).queryAllByRole("link")).toHaveLength(1);

    within(searchDialog)
      .queryAllByRole("link")
      .forEach((link, index) => {
        expect(link).toHaveTextContent(responses.resolved[index].title);
        expect(link).toHaveTextContent(responses.resolved[index].summary);
      });

    const revisedMarks = document.querySelectorAll("mark");

    // It should higlight the query within the results
    expect(revisedMarks.length).toBe(2);

    revisedMarks.forEach((mark) => {
      expect(mark).toHaveTextContent(revisedSearchQuery);
    });

    // It should persist the query in the search input
    expect(searchInput).toHaveValue(revisedSearchQuery);
    expect(searchInput).toHaveDisplayValue(revisedSearchQuery);

    screen.debug();
  });

  test("a request to close the search dialog is fired when clicking the modal backdrop", () => {
    const onRequestToCloseMock = jest.fn();

    render(<MultipleResultsFound onRequestToClose={onRequestToCloseMock} />);

    userEvent.click(screen.getByRole("presentation").firstChild);

    expect(onRequestToCloseMock).toHaveBeenCalledTimes(1);

    onRequestToCloseMock.mockRestore();
  });

  test("a request to close the search dialog is fired when clicking the close button", () => {
    const onRequestToCloseMock = jest.fn();

    render(<MultipleResultsFound onRequestToClose={onRequestToCloseMock} />);

    const searchDialog = screen.queryByRole("dialog");

    userEvent.click(
      within(searchDialog).getByRole("button", { name: /close/i })
    );

    expect(onRequestToCloseMock).toHaveBeenCalledTimes(1);

    onRequestToCloseMock.mockRestore();
  });

  test("a request to close the search dialog is fired when pressing the escape key", () => {
    const onRequestToCloseMock = jest.fn();

    render(<MultipleResultsFound onRequestToClose={onRequestToCloseMock} />);

    userEvent.type(screen.getByRole("searchbox"), `${specialChars.escape}`, {
      skipClick: true,
    });

    expect(onRequestToCloseMock).toHaveBeenCalledTimes(1);

    onRequestToCloseMock.mockRestore();
  });

  test("clearing the query using the clear button resets the component to an inital state", async () => {
    render(<MultipleResultsFound />);

    const searchDialog = screen.queryByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // Enter a search query
    userEvent.type(searchInput, "test");

    // Await for results
    await waitFor(() => {
      expect(within(searchDialog).queryAllByRole("link")).toHaveLength(
        responses.resolved.length
      );
    });

    const clearQueryButton = within(searchDialog).queryByRole("button", {
      name: /clear query/i,
    });

    // Click the clear query button
    userEvent.click(clearQueryButton);

    // It does not display a loading indicator
    expect(
      within(searchDialog).queryByRole("progressbar")
    ).not.toBeInTheDocument();

    // It does not display a clear query button
    expect(
      within(searchDialog).queryByRole("button", { name: /clear query/i })
    ).not.toBeInTheDocument();

    // It does not display any results
    expect(within(searchDialog).queryAllByRole("link")).toHaveLength(0);

    // It does not display an error message or no results found message
    expect(
      within(searchDialog).queryByLabelText(/feedback/i)
    ).not.toBeInTheDocument();
  });

  test("clearing a query using the clear button, whilst a request is pending, prevents the output of the request response", async () => {
    const onQueryChangeSpy = jest.spyOn(
      MultipleResultsFound.args,
      "onQueryChange"
    );

    render(<MultipleResultsFound />);

    const searchDialog = screen.queryByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // Enter a search query
    userEvent.type(searchInput, "test");

    // Wait for search progress to reveal
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).toBeInTheDocument();
    });

    const clearQueryButton = within(searchDialog).queryByRole("button", {
      name: /clear query/i,
    });

    // Click the clear query button
    userEvent.click(clearQueryButton);

    // Await for the data to resolve
    await waitFor(() => {
      expect(onQueryChangeSpy).toHaveBeenCalled();
    });

    // It should not present any results to the user
    await waitFor(() => {
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });

    onQueryChangeSpy.mockRestore();
  });

  test("clearing the query using the keyboard resets the component to an inital state", async () => {
    render(<MultipleResultsFound />);

    const searchDialog = screen.queryByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // Enter a search query
    userEvent.type(searchInput, "test");

    // Await for results
    await waitFor(() => {
      expect(within(searchDialog).queryAllByRole("link")).toHaveLength(
        responses.resolved.length
      );
    });

    // Clear the text from the search query input
    userEvent.clear(searchInput);

    // It does not display a loading indicator
    expect(
      within(searchDialog).queryByRole("progressbar")
    ).not.toBeInTheDocument();

    // It does not display a clear query button
    expect(
      within(searchDialog).queryByRole("button", { name: /clear query/i })
    ).not.toBeInTheDocument();

    // It does not display any results
    expect(within(searchDialog).queryAllByRole("link")).toHaveLength(0);

    // It does not display an error message or no results found message
    expect(
      within(searchDialog).queryByLabelText(/feedback/i)
    ).not.toBeInTheDocument();
  });

  test("clearing the query using the keyboard, whilst a request is pending, prevents the output of the request response", async () => {
    const onQueryChangeSpy = jest.spyOn(
      MultipleResultsFound.args,
      "onQueryChange"
    );

    render(<MultipleResultsFound />);

    const searchDialog = screen.queryByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // Enter a search query
    userEvent.type(searchInput, "test");

    // Wait for search progress to reveal
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).toBeInTheDocument();
    });

    // Clear the text from the search query input
    userEvent.clear(searchInput);

    // Await for the data to resolve
    await waitFor(() => {
      expect(onQueryChangeSpy).toHaveBeenCalled();
    });

    // It should not present any results to the user
    await waitFor(() => {
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });

    onQueryChangeSpy.mockRestore();
  });
});
