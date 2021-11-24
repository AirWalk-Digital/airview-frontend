import React from "react";
import { screen, render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import { renderWithProviders } from "./utils/with-providers";
import * as stories from "../stories/link/link.stories";
import { Link } from "../components/link";

const {
  InternalLinkNonActiveMuiStyled,
  InternalLinkNonActiveNonMuiStyled,
  InternalLinkActiveMuiStyled,
  InternalLinkActiveNonMuiStyled,
  ExternalLinkMuiStyled,
  ExternalLinkNonMuiStyled,
} = composeStories(stories);

describe("Link", () => {
  test("it renders correctly when passed an internal link using MUI styles", () => {
    render(<InternalLinkNonActiveMuiStyled />);

    const linkElement = screen.getByRole("link", {
      name: InternalLinkNonActiveMuiStyled.args.children,
    });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveClass(
      InternalLinkNonActiveMuiStyled.args.activeClassName
    );
    expect(linkElement).toHaveAttribute(
      "href",
      InternalLinkNonActiveMuiStyled.args.href
    );
    expect(linkElement).not.toHaveAttribute("rel", "noreferrer");
    expect(linkElement).not.toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed an internal link not using MUI styles", () => {
    render(<InternalLinkNonActiveNonMuiStyled />);

    const linkElement = screen.getByRole("link", {
      name: InternalLinkNonActiveNonMuiStyled.args.children,
    });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveClass(
      InternalLinkNonActiveNonMuiStyled.args.activeClassName
    );
    expect(linkElement).toHaveAttribute(
      "href",
      InternalLinkNonActiveNonMuiStyled.args.href
    );
    expect(linkElement).not.toHaveAttribute("rel", "noreferrer");
    expect(linkElement).not.toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed an external link using MUI styles", () => {
    render(<ExternalLinkMuiStyled />);

    const linkElement = screen.getByRole("link", {
      name: ExternalLinkMuiStyled.args.children,
    });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveClass(
      ExternalLinkMuiStyled.args.activeClassName
    );
    expect(linkElement).toHaveAttribute(
      "href",
      ExternalLinkMuiStyled.args.href
    );
    expect(linkElement).toHaveAttribute("rel", "noreferrer");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed an external link not using MUI styles", () => {
    render(<ExternalLinkNonMuiStyled />);

    const linkElement = screen.getByRole("link", {
      name: ExternalLinkNonMuiStyled.args.children,
    });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveClass(
      ExternalLinkNonMuiStyled.args.activeClassName
    );
    expect(linkElement).toHaveAttribute(
      "href",
      ExternalLinkNonMuiStyled.args.href
    );
    expect(linkElement).toHaveAttribute("rel", "noreferrer");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  test("it applies an active classname when the internal link href matches the current route, using MUI styles", () => {
    render(<InternalLinkActiveMuiStyled />);

    const linkElement = screen.getByRole("link", {
      name: InternalLinkActiveMuiStyled.args.children,
    });

    expect(linkElement).toHaveClass(
      InternalLinkActiveMuiStyled.args.activeClassName
    );
  });

  test("it applies an active classname when the internal link href matches the current route, not using MUI styles", () => {
    render(<InternalLinkActiveNonMuiStyled />);

    const linkElement = screen.getByRole("link", {
      name: InternalLinkActiveNonMuiStyled.args.children,
    });

    expect(linkElement).toHaveClass(
      InternalLinkActiveNonMuiStyled.args.activeClassName
    );
  });

  test("it renders correctly when passed an internal file link", () => {
    render(<InternalLinkNonActiveNonMuiStyled href="/some-image.jpg" />);

    const linkElement = screen.getByRole("link", {
      name: InternalLinkNonActiveNonMuiStyled.args.children,
    });

    expect(linkElement).toHaveAttribute("rel", "noreferrer");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed a telephone (tel:) number", () => {
    render(<InternalLinkNonActiveNonMuiStyled href="tel:01234567890" />);

    const linkElement = screen.getByRole("link", {
      name: InternalLinkNonActiveNonMuiStyled.args.children,
    });

    expect(linkElement).toHaveAttribute("rel", "noreferrer");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed an email (mailto:) address", () => {
    render(<InternalLinkNonActiveNonMuiStyled href="mailto:mail@mail.com" />);

    const linkElement = screen.getByRole("link", {
      name: InternalLinkNonActiveNonMuiStyled.args.children,
    });

    expect(linkElement).toHaveAttribute("rel", "noreferrer");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  test("it should forward a ref to an internal link using MUI styles", () => {
    const mockRef = jest.fn();

    renderWithProviders(
      <Link href="/" noLinkStyle={false} ref={mockRef}>
        Link Label
      </Link>
    );

    expect(mockRef).toHaveBeenCalled();
  });

  test("it should not forward a ref to an internal link not using MUI styles", () => {
    const mockRef = jest.fn();

    renderWithProviders(
      <Link href="/" noLinkStyle={true} ref={mockRef}>
        Link Label
      </Link>
    );

    expect(mockRef).not.toHaveBeenCalled();
  });

  test("it should forward a ref to an external link using MUI styles", () => {
    const mockRef = jest.fn();

    renderWithProviders(
      <Link href="https://google.co.uk" noLinkStyle={false} ref={mockRef}>
        Link Label
      </Link>
    );

    expect(mockRef).toHaveBeenCalled();
  });

  test("it should forward a ref to an external link not using MUI styles", () => {
    const mockRef = jest.fn();

    renderWithProviders(
      <Link href="https://google.co.uk" noLinkStyle={true} ref={mockRef}>
        Link Label
      </Link>
    );

    expect(mockRef).toHaveBeenCalled();
  });
});
