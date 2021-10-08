import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationTileTitle } from "../components/application-tile";

describe("ApplicationTileTitle - default render", () => {
  beforeEach(() => {
    render(<ApplicationTileTitle>Title content</ApplicationTileTitle>);
  });

  it("should pass through values passed to the children prop", () => {
    expect(screen.getByText("Title content")).toBeInTheDocument();
  });

  it("should render the title as a header level 2 tag", () => {
    expect(screen.getByText("Title content").tagName).toBe("H2");
  });
});

describe("ApplicationTileTile - with value passed to the level prop", () => {
  it("should render the title with a heading level tag equal to the passed value", () => {
    render(
      <ApplicationTileTitle level="h6">Title content</ApplicationTileTitle>
    );

    expect(screen.getByText("Title content").tagName).toBe("H6");
  });
});

describe("ApplicatioTileTitle - with a value passed to the classNames prop", () => {
  it("should output the passed classnames to the root node", () => {
    const { container } = render(
      <ApplicationTileTitle classNames="test-css-classname">
        Title content
      </ApplicationTileTitle>
    );

    expect(container.firstChild).toHaveClass("test-css-classname");
  });
});
