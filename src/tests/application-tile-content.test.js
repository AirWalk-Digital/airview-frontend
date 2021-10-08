import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationTileContent } from "../components/application-tile";

describe("ApplicationTileContent - default render", () => {
  beforeEach(() => {
    render(
      <ApplicationTileContent>
        <span>Test Content</span>
      </ApplicationTileContent>
    );
  });

  it("should not render the collapsible content toggle UI", () => {
    expect(screen.queryByRole("button", { name: /content/i })).toBeFalsy();
  });

  it("should display all values passed to the children prop", () => {
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});

describe("ApplicationTileContent - with collapsible content prop set to true", () => {
  it("should render the collapsible content toggle UI", () => {
    render(
      <ApplicationTileContent collapsible>
        <span>Test Content</span>
      </ApplicationTileContent>
    );

    expect(
      screen.queryByRole("button", { name: /content/i })
    ).toBeInTheDocument();
  });

  describe("and with no value passed to the initialCollapsed prop", () => {
    beforeEach(() => {
      render(
        <ApplicationTileContent collapsible>
          <span>Test Content</span>
        </ApplicationTileContent>
      );
    });

    it("should display all values passed to the children prop", () => {
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should indicate to the user that the content can be collapsed", () => {
      expect(
        screen.getByRole("button", { name: "Collapse content" })
      ).toBeInTheDocument();
    });
  });

  describe("and with a truthy value passed to the initialCollapsed prop", () => {
    beforeEach(() => {
      render(
        <ApplicationTileContent collapsible initialCollapsed>
          <span>Test Content</span>
        </ApplicationTileContent>
      );
    });

    it("should not display all values passed to the children prop", () => {
      expect(screen.getByText("Test Content")).not.toBeVisible();
    });

    it("should indicate to the user that the collapsed content can be expanded", () => {
      expect(
        screen.getByRole("button", { name: "Expand content" })
      ).toBeInTheDocument();
    });

    it("should allow a user to expand the collapsed content on click of the expand UI", async () => {
      userEvent.click(screen.getByRole("button", { name: "Expand content" }));

      expect(await screen.getByText("Test Content")).toBeVisible();
    });
  });

  describe("and with a falsy value passed to the initialCollapsed prop", () => {
    beforeEach(() => {
      render(
        <ApplicationTileContent collapsible initialCollapsed={false}>
          <span>Test Content</span>
        </ApplicationTileContent>
      );
    });

    it("should display all values passed to the children prop", () => {
      expect(screen.getByText("Test Content")).toBeVisible();
    });

    it("should indicate to the user that the expanded content can be collapsed", () => {
      expect(
        screen.getByRole("button", { name: "Collapse content" })
      ).toBeInTheDocument();
    });

    it("should allow a user to collapse the expanded content on click of the collapse UI", async () => {
      userEvent.click(screen.getByRole("button", { name: "Collapse content" }));

      expect(
        await screen.getByRole("button", { name: "Expand content" })
      ).toBeInTheDocument();
    });
  });
});

describe("ApplicationTileContent - with a value passed to the classNames prop", () => {
  it("should output the passed classnames to the root node", () => {
    const { container } = render(
      <ApplicationTileContent classNames="test-css-classname">
        <span>Test Content</span>
      </ApplicationTileContent>
    );

    expect(container.firstChild).toHaveClass("test-css-classname");
  });
});
