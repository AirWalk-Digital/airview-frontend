import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent, { specialChars } from "@testing-library/user-event";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/page-header/page-header.stories";
import { responses } from "../stories/search/responses";

const { PreviewDisabled, Loading, PreviewEnabled } = composeStories(stories);

describe("PageHeader", () => {
  describe("with preview disabled", () => {
    test("the initial render is correct", async () => {
      render(<PreviewDisabled />);

      // It should not reveal the main nvigation
      expect(
        screen.queryByRole("navigation", { name: /main navigation/i })
      ).not.toBeInTheDocument();

      // It should not reveal the site title
      expect(
        screen.queryByRole("heading", { name: PreviewDisabled.args.siteTitle })
      ).not.toBeInTheDocument();

      // It should not reveal the version
      expect(
        screen.queryByText(PreviewDisabled.args.version)
      ).not.toBeInTheDocument();

      // It should not reveal the search UI
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();

      const logo = screen.getByRole("img", {
        name: PreviewDisabled.args.siteTitle,
      });

      // It should output the logo
      expect(logo).toBeInTheDocument();

      // It should set the logo src equal to the value passed
      // expect(logo).toHaveAttribute("src", PreviewDisabled.args.logoSrc);

      const homeLink = screen.getByRole("link", {
        name: PreviewDisabled.siteTitle,
      });

      // It should output a link to the homepage
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");

      // It should set the reveal search button as enabled
      expect(screen.getByRole("button", { name: /search/i })).toBeEnabled();
    });

    test("a user can toggle the visibility of the app drawer contents", async () => {
      render(<PreviewDisabled />);

      // Open the app drawer
      userEvent.click(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        })
      );

      // It presents the site title
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: PreviewDisabled.args.siteTitle })
        ).toBeInTheDocument();
      });

      // It presents the site version
      expect(
        screen.getByText(PreviewDisabled.args.version)
      ).toBeInTheDocument();

      const mainNavigation = screen.getByRole("navigation", {
        name: /main navigation/i,
      });

      // It presents the main navigation
      expect(mainNavigation).toBeInTheDocument();

      // It does not render the navigation in a loading state
      expect(mainNavigation).toHaveAttribute("aria-busy", "false");

      // It renders all passed navigation links
      expect(
        within(mainNavigation).getAllByRole("link").length
      ).toBeGreaterThan(0);

      // Closing the app drawer
      userEvent.click(screen.getByRole("presentation").firstChild);

      // It removes the site title from view
      await waitFor(() => {
        expect(
          screen.queryByRole("heading", {
            name: PreviewDisabled.args.siteTitle,
          })
        ).not.toBeInTheDocument();
      });

      // It removes the version from view
      await waitFor(() => {
        expect(
          screen.queryByText(PreviewDisabled.args.version)
        ).not.toBeInTheDocument();
      });

      // It removes the main navigation from view
      await waitFor(() => {
        expect(
          screen.queryByRole("navigation", {
            name: /main navigation/i,
          })
        ).not.toBeInTheDocument();
      });
    });

    test("a user can toggle the visibility of the search UI", async () => {
      render(<PreviewDisabled />);

      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();

      const openSearchButton = screen.getByRole("button", { name: /search/i });

      userEvent.click(openSearchButton);

      // It should open the search UI on click of the search button
      await waitFor(() => {
        expect(screen.getByRole("searchbox")).toBeInTheDocument();
      });

      userEvent.click(screen.getByRole("button", { name: /close/i }));

      // It should close the search UI on click of the close search button
      await waitFor(() => {
        expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
      });

      userEvent.type(document.querySelector("body"), "/", { skipClick: true });

      // It should open the search UI on press of the correct keystroke
      await waitFor(() => {
        expect(screen.getByRole("searchbox")).toBeInTheDocument();
      });

      userEvent.click(screen.getByRole("presentation").firstChild);

      // It should close the search UI on click of the search UI modal background
      await waitFor(() => {
        expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
      });

      userEvent.click(openSearchButton);

      await waitFor(() => {
        expect(screen.getByRole("searchbox")).toBeInTheDocument();
      });

      userEvent.type(document.querySelector("body"), `${specialChars.escape}`, {
        skipClick: true,
      });

      // It should the search UI on press of the escape key
      await waitFor(() => {
        expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
      });
    });

    test("when a user closes an open Search component, it resets the search UI to an initial state", async () => {
      render(<PreviewDisabled />);

      const revealSearchButton = screen.getByRole("button", {
        name: /search/i,
      });

      userEvent.click(revealSearchButton);

      // Enter a search query
      userEvent.type(screen.getByRole("searchbox"), "test");

      // Await for results
      await waitFor(() => {
        expect(screen.getByRole("link")).toBeInTheDocument();
      });

      // Close search UI
      userEvent.click(screen.getByRole("button", { name: /close/i }));

      await waitFor(() => {
        expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
      });

      // Re-open the search UI
      userEvent.click(revealSearchButton);

      const searchDialog = screen.queryByRole("dialog");

      // Search input should be set to an empty value
      expect(screen.getByRole("searchbox")).not.toHaveValue();
      expect(screen.getByRole("searchbox")).not.toHaveDisplayValue();

      // The loading indicator should not be present
      expect(
        within(searchDialog).queryByRole("progressbar")
      ).not.toBeInTheDocument();

      // It does not display a clear query button
      expect(
        within(searchDialog).queryByRole("button", { name: /clear query/i })
      ).not.toBeInTheDocument();

      // It does not display any results
      expect(within(searchDialog).queryAllByRole("link")).toHaveLength(0);
    });

    test("when a user toggles the visibility of the Search component whilst a request is pending, the output of the request response is not rendered when re-opended", async () => {
      const onQueryChangeSpy = jest.spyOn(
        PreviewDisabled.args,
        "onQueryChange"
      );

      onQueryChangeSpy.mockResolvedValue(responses.resolved[0]);

      render(<PreviewDisabled />);

      const revealSearchButton = screen.getByRole("button", {
        name: /search/i,
      });

      // Reveal search UI
      userEvent.click(revealSearchButton);

      const searchDialog = screen.queryByRole("dialog");

      const searchInput = within(searchDialog).getByRole("searchbox");

      // Enter a search query
      userEvent.type(searchInput, "test");

      // Close search UI
      userEvent.click(
        within(searchDialog).getByRole("button", { name: /close/i })
      );

      await waitFor(() => {
        expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
      });

      // Re-open the search UI
      userEvent.click(revealSearchButton);

      await waitFor(() => expect(onQueryChangeSpy).toHaveBeenCalled());

      // It should not present any results to the user
      await waitFor(() => {
        expect(
          within(screen.getByRole("dialog")).queryAllByRole("link")
        ).toHaveLength(0);
      });

      onQueryChangeSpy.mockRestore();
    });

    describe("in a loading state", () => {
      test("the initial render is correct", async () => {
        render(<Loading />);

        // It should not reveal the main nvigation
        expect(
          screen.queryByRole("navigation", { name: /main navigation/i })
        ).not.toBeInTheDocument();

        // It should not reveal the site title
        expect(
          screen.queryByRole("heading", {
            name: PreviewDisabled.args.siteTitle,
          })
        ).not.toBeInTheDocument();

        // It should not reveal the version
        expect(
          screen.queryByText(PreviewDisabled.args.version)
        ).not.toBeInTheDocument();

        // It should not reveal the search UI
        expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();

        const logo = screen.getByRole("img", {
          name: PreviewDisabled.args.siteTitle,
        });

        // It should output the logo
        expect(logo).toBeInTheDocument();

        // It should set the logo src equal to the value passed
        // expect(logo).toHaveAttribute("src", PreviewDisabled.args.logoSrc);

        const homeLink = screen.getByRole("link", {
          name: PreviewDisabled.siteTitle,
        });

        // It should output a link to the homepage
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute("href", "/");

        // It should disbale the reveal search button
        expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
      });

      test("a user can toggle the visibility of the app drawer contents", async () => {
        render(<Loading />);

        // Open the app drawer
        userEvent.click(
          screen.getByRole("button", {
            name: /open navigation menu/i,
          })
        );

        // It presents the site title
        await waitFor(() => {
          expect(
            screen.getByRole("heading", {
              name: PreviewDisabled.args.siteTitle,
            })
          ).toBeInTheDocument();
        });

        // It presents the site version
        expect(
          screen.getByText(PreviewDisabled.args.version)
        ).toBeInTheDocument();

        const mainNavigation = screen.getByRole("navigation");

        // It presents the main navigation in a loading state
        expect(mainNavigation).toBeInTheDocument();

        expect(mainNavigation).toHaveAttribute("aria-busy", "true");

        // It renders navigation links as placeholders
        expect(within(mainNavigation).queryAllByRole("link").length).toBe(0);

        // Closing the app drawer
        userEvent.click(screen.getByRole("presentation").firstChild);

        // It removes the site title from view
        await waitFor(() => {
          expect(
            screen.queryByRole("heading", {
              name: PreviewDisabled.args.siteTitle,
            })
          ).not.toBeInTheDocument();
        });

        // It removes the version from view
        await waitFor(() => {
          expect(
            screen.queryByText(PreviewDisabled.args.version)
          ).not.toBeInTheDocument();
        });

        // It removes the main navigation from view
        await waitFor(() => {
          expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
        });
      });
    });

    describe("with preview enabled", () => {
      test.todo("in a preview enabled state, it renders corerctly");
    });
  });
});
