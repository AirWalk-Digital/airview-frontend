import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppTilesTemplateLoadMoreItems } from "../components/app-tiles-template";

describe("AppTilesTemplateLoadMoreItems", () => {
  beforeEach(() => {
    render(
      <AppTilesTemplateLoadMoreItems
        buttonLabel="Load More"
        ariaLabel="Load more"
        onClick={() => {}}
        isLoading={false}
      />
    );
  });

  it("should output a button", () => {
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render the button label equal to the value passed to the buttonLabel prop", () => {
    expect(screen.getByRole("button")).toHaveTextContent("Load More");
  });

  it("should apply an aria-label to the button equal to the value passed to the ariaLabel prop", () => {
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Load more"
    );
  });
});

describe("AppTilesTemplateLoadMoreItems - not loading", () => {
  const handleOnLoadMoreClick = jest.fn();

  beforeEach(() => {
    render(
      <AppTilesTemplateLoadMoreItems
        buttonLabel="Load More"
        ariaLabel="Load more"
        onClick={handleOnLoadMoreClick}
        isLoading={false}
      />
    );
  });

  afterEach(() => {
    handleOnLoadMoreClick.mockClear();
  });

  it("should not indicate to the user that a loading action is occurring", () => {
    expect(screen.queryByRole("progressbar")).toBeFalsy();
  });

  it("should call the onClick callback when clicked", () => {
    userEvent.click(screen.getByRole("button", { name: "Load more" }));

    expect(handleOnLoadMoreClick).toHaveBeenCalledTimes(1);
  });
});

describe("AppTilesTemplateLoadMoreItems - loading", () => {
  const handleOnLoadMoreClick = jest.fn();

  beforeEach(() => {
    render(
      <AppTilesTemplateLoadMoreItems
        buttonLabel="Load More"
        ariaLabel="Load more"
        onClick={handleOnLoadMoreClick}
        isLoading={true}
      />
    );
  });

  afterEach(() => {
    handleOnLoadMoreClick.mockClear();
  });

  it("should indicate to the user that a loading action is occurring", () => {
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should not call the onClick callback when clicked", () => {
    userEvent.click(screen.getByRole("button", { name: "Load more" }));

    expect(handleOnLoadMoreClick).not.toHaveBeenCalled();
  });
});
