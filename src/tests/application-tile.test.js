import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationTile } from "../components/application-tile";

describe("ApplicationTile - with values passed to the children props", () => {
  it("should pass through all values without side effects", () => {
    render(<ApplicationTile>Test content</ApplicationTile>);

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});

describe("ApplicationTile - with a value passed to the classNames prop", () => {
  it("should output the passed classnames to the root node", () => {
    const { container } = render(
      <ApplicationTile classNames="test-css-classname" />
    );

    expect(container.firstChild).toHaveClass("test-css-classname");
  });
});
