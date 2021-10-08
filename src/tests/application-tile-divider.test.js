import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationTileDivider } from "../components/application-tile";

describe("ApplicationTileDivider - default render", () => {
  beforeEach(() => {
    render(<ApplicationTileDivider />);
  });

  it("should render a divider to the page", () => {
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

describe("ApplicationTileDivider - with a value passed to the classNames prop", () => {
  it("should output the passed classnames to the root node", () => {
    const { container } = render(
      <ApplicationTileDivider classNames="test-css-classname" />
    );

    expect(container.firstChild).toHaveClass("test-css-classname");
  });
});
