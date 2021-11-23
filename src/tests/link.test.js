import React from "react";
import { screen, render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import { renderWithProviders } from "./utils/with-providers";
import * as stories from "../stories/link/link.stories";
import { Link } from "../components/link";

const {
  MuiStyledInternalLink,
  NonMuiStyledInternalLink,
  ActiveMuiStyledInternalLink,
  NonActiveMuiStyledInternalLink,
  MuiStyledExternalLink,
  NonMuiStyledExternalLink,
} = composeStories(stories);

describe("Link", () => {
  test("it renders correctly when passed an internal link using MUI styles", () => {
    render(<MuiStyledInternalLink />);

    const linkElement = screen.getByRole("link", {
      name: MuiStyledInternalLink.args.children,
    });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveClass(
      MuiStyledInternalLink.args.activeClassName
    );
    expect(linkElement).toHaveAttribute(
      "href",
      MuiStyledInternalLink.args.href
    );
    expect(linkElement).not.toHaveAttribute("rel", "noreferrer");
    expect(linkElement).not.toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed an internal link not using MUI styles", () => {
    render(<NonMuiStyledInternalLink />);

    const linkElement = screen.getByRole("link", {
      name: NonMuiStyledInternalLink.args.children,
    });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveClass(
      NonMuiStyledInternalLink.args.activeClassName
    );
    expect(linkElement).toHaveAttribute(
      "href",
      NonMuiStyledInternalLink.args.href
    );
    expect(linkElement).not.toHaveAttribute("rel", "noreferrer");
    expect(linkElement).not.toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed an external link using MUI styles", () => {
    render(<MuiStyledExternalLink />);

    const linkElement = screen.getByRole("link", {
      name: MuiStyledExternalLink.args.children,
    });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveClass(
      MuiStyledExternalLink.args.activeClassName
    );
    expect(linkElement).toHaveAttribute(
      "href",
      MuiStyledExternalLink.args.href
    );
    expect(linkElement).toHaveAttribute("rel", "noreferrer");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed an external link not using MUI styles", () => {
    render(<NonMuiStyledExternalLink />);

    const linkElement = screen.getByRole("link", {
      name: NonMuiStyledExternalLink.args.children,
    });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveClass(
      NonMuiStyledExternalLink.args.activeClassName
    );
    expect(linkElement).toHaveAttribute(
      "href",
      NonMuiStyledExternalLink.args.href
    );
    expect(linkElement).toHaveAttribute("rel", "noreferrer");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  test("it applies an active classname when the internal link href matches the current route, using MUI styles", () => {
    render(<ActiveMuiStyledInternalLink />);

    const linkElement = screen.getByRole("link", {
      name: ActiveMuiStyledInternalLink.args.children,
    });

    expect(linkElement).toHaveClass(
      ActiveMuiStyledInternalLink.args.activeClassName
    );
  });

  test("it applies an active classname when the internal link href matches the current route, not using MUI styles", () => {
    render(<NonActiveMuiStyledInternalLink />);

    const linkElement = screen.getByRole("link", {
      name: NonActiveMuiStyledInternalLink.args.children,
    });

    expect(linkElement).toHaveClass(
      NonActiveMuiStyledInternalLink.args.activeClassName
    );
  });

  test("it renders correctly when passed an internal file link", () => {
    render(<NonMuiStyledInternalLink href="/some-image.jpg" />);

    const linkElement = screen.getByRole("link", {
      name: NonMuiStyledInternalLink.args.children,
    });

    expect(linkElement).toHaveAttribute("rel", "noreferrer");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed a telephone (tel:) number", () => {
    render(<NonMuiStyledInternalLink href="tel:01234567890" />);

    const linkElement = screen.getByRole("link", {
      name: NonMuiStyledInternalLink.args.children,
    });

    expect(linkElement).toHaveAttribute("rel", "noreferrer");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  test("it renders correctly when passed an email (mailto:) address", () => {
    render(<NonMuiStyledInternalLink href="mailto:mail@mail.com" />);

    const linkElement = screen.getByRole("link", {
      name: NonMuiStyledInternalLink.args.children,
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
