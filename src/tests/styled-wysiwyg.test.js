import React from "react";
import { render, screen } from "@testing-library/react";
import { StyledWysiwyg } from "../components/styled-wysiwyg";

describe("StyledWysiwyg - component parent tag prop", () => {
  it("should set the tag equal to the passed tag prop", () => {
    const { container } = render(
      <StyledWysiwyg tag="article" testid="container" />
    );

    const element = container.querySelector("[data-testid='container']");
    expect(element.tagName).toBe("ARTICLE");
  });

  it("should default the tag to 'div' when a tag prop is not set", () => {
    const { container } = render(<StyledWysiwyg testid="container" />);

    const element = container.querySelector("[data-testid='container']");
    expect(element.tagName).toBe("DIV");
  });
});

describe("StyledWysiwyg - child props", () => {
  it("should pass through child props without side effects", () => {
    render(
      <StyledWysiwyg testid="container" tag="article">
        <span>Test content</span>
      </StyledWysiwyg>
    );

    expect(screen.getByRole("article")).toContainHTML(
      "<span>Test content</span>"
    );
  });
});

describe("StyledWysiwyg - test ID prop", () => {
  it("should apply a test id to the component parent node, equal to the value of the testid prop", () => {
    render(<StyledWysiwyg testid="container" />);

    expect(screen.getByTestId("container")).toBeInTheDocument();
  });
});
