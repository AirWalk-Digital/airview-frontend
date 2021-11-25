import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./utils/with-providers";
import { PageHeader } from "../components/page-header";

const handleOnEnableCmsClick = jest.fn();

afterEach(() => {
  handleOnEnableCmsClick.mockClear();
});

describe("PageHeader - drawer content", () => {
  beforeEach(() => {
    renderWithProviders(
      <React.Fragment>
        <PageHeader
          navItems={[
            {
              id: "1",
              name: "Navigation Item",
              url: "one",
            },
          ]}
          currentRoute="one"
          showEnableCmsButton={true}
          onEnableCmsClick={handleOnEnableCmsClick}
          testid="Test id"
        />
        <div>Click me</div>
      </React.Fragment>
    );
  });

  it("should not render the drawer content by default", () => {
    expect(screen.queryByText("Navigation Item")).toBeNull();
  });

  it("should reveal the drawer on click of the Show navigation menu button", async () => {
    userEvent.click(screen.getByLabelText("Show navigation menu"));

    await waitFor(() => {
      expect(screen.queryByText("Navigation Item")).toBeInTheDocument();
    });
  });

  it("should hide the drawer on request to close by a user", async () => {
    userEvent.click(screen.getByLabelText("Show navigation menu"));

    await waitFor(() => {
      expect(screen.queryByText("Navigation Item")).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("presentation").firstChild);

    await waitFor(() => {
      expect(screen.queryByText("Navigation Item")).not.toBeInTheDocument();
    });
  });
});

describe("PageHeader - test ID prop", () => {
  it("should apply a test id to the component parent node, equal to the value of the testid prop", () => {
    renderWithProviders(
      <PageHeader
        navItems={[
          {
            id: "1",
            name: "Navigation Item",
            url: "one",
          },
        ]}
        currentRoute="one"
        showEnableCmsButton={true}
        onEnableCmsClick={handleOnEnableCmsClick}
        testid="Test id"
      />
    );

    expect(screen.getByTestId("Test id")).toBeInTheDocument();
  });
});

test.todo("closing the Search component resets it to an initial state");

test.todo(
  "closing the Search component whilst a request is pending, prevents the output of the request response"
);
