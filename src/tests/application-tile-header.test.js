import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationTileHeader } from "../components/application-tile";

test("it should output content passed to the leftContent prop", () => {
  render(
    <ApplicationTileHeader leftContent={<span>test left content</span>} />
  );

  expect(screen.getByText(/test left content/i)).toBeInTheDocument();
});

test("it should output content passed to the rightContent prop", () => {
  render(
    <ApplicationTileHeader rightContent={<span>test right content</span>} />
  );

  expect(screen.getByText(/test right content/i)).toBeInTheDocument();
});

test("it should output the passed classnames to the root node", () => {
  const { container } = render(
    <ApplicationTileHeader classNames="test-css-classname">
      Test Content
    </ApplicationTileHeader>
  );

  expect(container.firstChild).toHaveClass("test-css-classname");
});
