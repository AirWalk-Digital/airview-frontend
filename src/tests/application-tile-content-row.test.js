import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationTileContentRow } from "../components/application-tile";

describe("ApplicationTileContentRow - default render", () => {
  it("should pass through values passed to the children prop", () => {
    render(<ApplicationTileContentRow>Test Content</ApplicationTileContentRow>);

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});

describe("ApplicationTileContentRow - with a value passed to the classNames prop", () => {
  it("should output the passed classnames to the root node", () => {
    const { container } = render(
      <ApplicationTileContentRow classNames="test-css-classname">
        Test Content
      </ApplicationTileContentRow>
    );

    expect(container.firstChild).toHaveClass("test-css-classname");
  });
});
