import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent, { specialChars } from "@testing-library/user-event";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/search/search.stories";
import { responses } from "../stories/search/responses";

const {
  Default,
  SearchInProgress,
  SingleResultFound,
  NoResultsFound,
  Error,
} = composeStories(stories);

describe("Search", () => {
  test("in a closed state", () => {
    render(<Default open={false} />);

    const searchDialog = screen.queryByRole("dialog");

    // It does not render the search dialog
    expect(searchDialog).not.toBeInTheDocument();
  });

  test("in a initial open state", async () => {
    render(<Default />);

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

  test("in a search in progress state", async () => {
    render(<SearchInProgress />);

    const searchQuery = "test";

    await SearchInProgress.play({ searchQuery });

    const searchDialog = await screen.findByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

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
  });

  test("in a resolved state", async () => {
    render(<SingleResultFound />);

    const searchQuery = "test";

    await SingleResultFound.play({ searchQuery });

    const searchDialog = await screen.findByRole("dialog");

    const searchInput = within(searchDialog).getByRole("searchbox");

    // It should persist the query in the search input
    expect(searchInput).toHaveValue(searchQuery);
    expect(searchInput).toHaveDisplayValue(searchQuery);

    // It should present a clear search button
    await waitFor(() => {
      expect(
        within(searchDialog).getByRole("button", { name: /clear/i })
      ).toBeInTheDocument();
    });

    // It should not present the search progress indicator
    await waitFor(() => {
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).not.toBeInTheDocument();
    });
  });

  test("with result found", async () => {
    const onQueryChangeSpy = jest.spyOn(
      SingleResultFound.args,
      "onQueryChange"
    );

    render(<SingleResultFound />);

    const searchQuery = "ipsum";

    SingleResultFound.play({ searchQuery });

    const result = await screen.findByRole("link");

    // It should output the result
    expect(result).toHaveTextContent(responses.resolved[0].title);
    expect(result).toHaveTextContent(responses.resolved[0].summary);

    // It should higlight the query within the results
    const marks = document.querySelectorAll("mark");

    expect(marks.length).toBe(2);

    marks.forEach((mark) => {
      expect(mark).toHaveTextContent(searchQuery);
    });

    // It debounces the query change callback
    expect(onQueryChangeSpy).toHaveBeenCalledTimes(1);

    // It calls the query change callback with the argument equal to the search query
    expect(onQueryChangeSpy).toHaveBeenCalledWith(searchQuery);

    onQueryChangeSpy.mockRestore();
  });

  test("with no results", async () => {
    render(<NoResultsFound />);

    const searchQuery = "ipsum";

    NoResultsFound.play({ searchQuery });

    // It should output a message indicating no results found
    await waitFor(() => {
      expect(screen.queryByLabelText(/feedback/i)).toHaveTextContent(
        `No results found for "${searchQuery}`
      );
    });
  });

  test("with an error", async () => {
    render(<Error />);

    Error.play();

    // It should remove the search progress indicator
    await waitFor(() => {
      expect(screen.queryByLabelText(/feedback/i)).toHaveTextContent(/error/i);
    });
  });

  test("a user can perform subsequent searches without having to close the component", async () => {
    render(<SingleResultFound />);

    SingleResultFound.play();

    await waitFor(() => {
      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    userEvent.clear(screen.getByRole("searchbox"));

    const searchQuery = "Sed";

    SingleResultFound.play({ searchQuery });

    await waitFor(() => {
      const link = screen.getByRole("link");

      expect(link).toHaveTextContent(responses.resolved[0].title);
      expect(link).toHaveTextContent(responses.resolved[0].summary);
    });

    const marks = document.querySelectorAll("mark");

    // It should higlight the query within the results
    expect(marks.length).toBe(1);

    marks.forEach((mark) => {
      expect(mark).toHaveTextContent(searchQuery);
    });
  });

  test("a request to close the search dialog is fired when clicking the modal backdrop", async () => {
    const onRequestToCloseMock = jest.fn();

    render(<Default onRequestToClose={onRequestToCloseMock} />);

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    userEvent.click(screen.getByRole("presentation").firstChild);

    expect(onRequestToCloseMock).toHaveBeenCalledTimes(1);

    onRequestToCloseMock.mockRestore();
  });

  test("a request to close the search dialog is fired when clicking the close button", async () => {
    const onRequestToCloseMock = jest.fn();

    render(<Default onRequestToClose={onRequestToCloseMock} />);

    const closeButton = await screen.findByRole("button", { name: /close/i });

    userEvent.click(closeButton);

    expect(onRequestToCloseMock).toHaveBeenCalledTimes(1);

    onRequestToCloseMock.mockRestore();
  });

  test("a request to close the search dialog is fired when pressing the escape key", async () => {
    const onRequestToCloseMock = jest.fn();

    render(<Default onRequestToClose={onRequestToCloseMock} />);

    const searchBox = await screen.findByRole("searchbox");

    userEvent.type(searchBox, `${specialChars.escape}`, {
      skipClick: true,
    });

    expect(onRequestToCloseMock).toHaveBeenCalledTimes(1);

    onRequestToCloseMock.mockRestore();
  });

  test("clearing the query using the clear button resets the component to an inital state", async () => {
    render(<SingleResultFound />);

    SingleResultFound.play();

    // Await for results
    await waitFor(() => {
      expect(screen.queryByRole("link")).toBeInTheDocument();
    });

    // Click the clear query button
    userEvent.click(
      screen.getByRole("button", {
        name: /clear query/i,
      })
    );

    // It does not display a loading indicator
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    // It does not display a clear query button
    expect(
      screen.queryByRole("button", { name: /clear query/i })
    ).not.toBeInTheDocument();

    // It does not display any results
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    // It does not display an error message or no results found message
    expect(screen.queryByLabelText(/feedback/i)).not.toBeInTheDocument();
  });

  test("clearing the query using the keyboard resets the component to an inital state", async () => {
    render(<SingleResultFound />);

    SingleResultFound.play();

    // Await for results
    await waitFor(() => {
      expect(screen.queryByRole("link")).toBeInTheDocument();
    });

    // Clear the text from the search query input
    userEvent.clear(screen.getByRole("searchbox"));

    // It does not display a loading indicator
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    // It does not display a clear query button
    expect(
      screen.queryByRole("button", { name: /clear query/i })
    ).not.toBeInTheDocument();

    // It does not display any results
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    // It does not display an error message or no results found message
    expect(screen.queryByLabelText(/feedback/i)).not.toBeInTheDocument();
  });

  test("clearing a query using the clear button, whilst a request is pending, prevents the output of the request response", async () => {
    const onQueryChangeSpy = jest.spyOn(
      SingleResultFound.args,
      "onQueryChange"
    );

    render(<SingleResultFound />);

    SingleResultFound.play();

    // Wait for search progress to reveal
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).toBeInTheDocument();
    });

    // Click the clear query button
    userEvent.click(
      screen.getByRole("button", {
        name: /clear query/i,
      })
    );

    // Await for the data to resolve
    await waitFor(() => {
      expect(onQueryChangeSpy).toHaveBeenCalled();
    });

    // It should not present any results to the user
    await waitFor(() => {
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    onQueryChangeSpy.mockRestore();
  });

  test("clearing the query using the keyboard, whilst a request is pending, prevents the output of the request response", async () => {
    const onQueryChangeSpy = jest.spyOn(
      SingleResultFound.args,
      "onQueryChange"
    );

    render(<SingleResultFound />);

    SingleResultFound.play();

    // Wait for search progress to reveal
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).toBeInTheDocument();
    });

    // Clear the text from the search query input
    userEvent.clear(screen.getByRole("searchbox"));

    // Await for the data to resolve
    await waitFor(() => {
      expect(onQueryChangeSpy).toHaveBeenCalled();
    });

    // It should not present any results to the user
    await waitFor(() => {
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    onQueryChangeSpy.mockRestore();
  });
});
