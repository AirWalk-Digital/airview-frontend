import React from "react";
import { screen } from "@testing-library/react";
import { ApplicationTileCallToActionButton } from "../components/application-tile";
import { renderWithProviders } from "./utils/with-providers";

const defaultProps = {
  href: "/some-internal-link",
  label: "Test Button Label",
  classNames: "test-classname",
};

function setupComponent(overrides) {
  return renderWithProviders(
    <ApplicationTileCallToActionButton {...{ ...defaultProps, overrides }} />
  );
}

describe("ApplicationTileCallToActionButton", () => {
  test("the component renders correctly", () => {
    setupComponent();

    const button = screen.getByRole("button", { name: defaultProps.label });

    // It renders the button to the DOM
    expect(button).toBeInTheDocument();

    // It sets the button link equal to the value passed via props
    expect(button).toHaveAttribute("href", defaultProps.href);

    // It applies a classname to the root dom node equal to the value passed via props
    expect(button).toHaveClass(defaultProps.classNames);
  });
});
