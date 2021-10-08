import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationTileHeader } from "../components/application-tile";

describe("ApplicationTileHeader - default render", () => {
  it("should pass through values passed to the children prop", () => {
    render(<ApplicationTileHeader>Test Content</ApplicationTileHeader>);

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});

describe("ApplicationTileHeader - with a value passed to the classNames prop", () => {
  it("should output the passed classnames to the root node", () => {
    const { container } = render(
      <ApplicationTileHeader classNames="test-css-classname">
        Test Content
      </ApplicationTileHeader>
    );

    expect(container.firstChild).toHaveClass("test-css-classname");
  });
});
