import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./utils/with-providers";
import { Link } from "../components/link";
import { LocationProvider } from "../hooks/use-location";

test("it should apply the correct attributes to the link when passed an external href prop", () => {
  const linkHref = "https://somedomain.com";

  renderWithProviders(<Link href={linkHref}>Test External Link</Link>);

  const linkElement = screen.getByRole("link", { name: /test external link/i });

  expect(linkElement).toHaveAttribute("rel", "noreferrer");
  expect(linkElement).toHaveAttribute("target", "_blank");
  expect(linkElement).toHaveAttribute("href", linkHref);
});

test("it should apply the correct attributes to the link when passed a mailto: href prop", () => {
  const linkHref = "mailto:someone@somedomain.com";

  renderWithProviders(<Link href={linkHref}>Test Email Link</Link>);

  const linkElement = screen.getByRole("link", { name: /test email link/i });

  expect(linkElement).toHaveAttribute("rel", "noreferrer");
  expect(linkElement).toHaveAttribute("target", "_blank");
  expect(linkElement).toHaveAttribute("href", linkHref);
});

test("it should apply the correct attributes to the link when passed a tel: href prop", () => {
  const linkHref = "tel:01234567890";

  renderWithProviders(<Link href={linkHref}>Test Tel Link</Link>);

  const linkElement = screen.getByRole("link", { name: /test tel link/i });

  expect(linkElement).toHaveAttribute("rel", "noreferrer");
  expect(linkElement).toHaveAttribute("target", "_blank");
  expect(linkElement).toHaveAttribute("href", linkHref);
});

test("it should apply the correct attributes when passed an internal href prop", () => {
  const linkHref = "/some-route";

  renderWithProviders(<Link href={linkHref}>Test Internal Link</Link>);

  const linkElement = screen.getByRole("link", { name: /test internal link/i });

  expect(linkElement).not.toHaveAttribute("rel", "noreferrer");
  expect(linkElement).not.toHaveAttribute("target", "_blank");
  expect(linkElement).toHaveAttribute("href", linkHref);
});

test("it should apply an active class name when the link href prop mathces the current location", () => {
  const linkHref = "/some-route";
  const activeClassName = "active";

  renderWithProviders(
    <LocationProvider location={linkHref}>
      <Link href={linkHref} activeClassName={activeClassName}>
        Test Internal Link
      </Link>
    </LocationProvider>,
    { route: linkHref }
  );

  const linkElement = screen.getByRole("link", { name: /test internal link/i });

  expect(linkElement).not.toHaveAttribute("rel", "noreferrer");
  expect(linkElement).not.toHaveAttribute("target", "_blank");
  expect(linkElement).toHaveAttribute("href", linkHref);
  expect(linkElement).toHaveClass("active");
});
