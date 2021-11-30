import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/knowledge-template/knowledge-template.stories";
import userEvent from "@testing-library/user-event";

const { PreviewDisabled, Loading } = composeStories(stories);

const getNavItems = (navItems) => {
  const output = [];

  navItems.forEach((navItem) => {
    if (navItem?.children) {
      output.push(...getNavItems(navItem.children));
    } else {
      output.push({
        name: navItem.name,
        url: navItem.url,
      });
    }
  });

  return output;
};

describe("ApplicationsTemplate", () => {
  describe("preview mode disabled", () => {
    describe("main header content", () => {
      test("it renders correctly", async () => {
        render(<PreviewDisabled />);

        const logo = screen.getByRole("img", {
          name: PreviewDisabled.args.siteTitle,
        });

        // It renders the logo to the document
        expect(logo).toBeInTheDocument();

        // It should set the logo src equal to the value passed
        // expect(logo).toHaveAttribute("src", PreviewDisabled.args.logoSrc);

        // It renders a link to the homepage
        const homeLink = screen.getByRole("link", {
          name: PreviewDisabled.args.siteTitle,
        });

        expect(homeLink).toHaveAttribute("href", "/");

        // Open navigation
        userEvent.click(
          screen.queryByRole("button", { name: /open navigation/i })
        );

        // It renders the site title
        await waitFor(() => {
          expect(
            screen.getByRole("heading", {
              name: PreviewDisabled.args.siteTitle,
            })
          ).toBeInTheDocument();
        });

        // It renders the site version
        expect(
          screen.getByText(PreviewDisabled.args.version)
        ).toBeInTheDocument();

        const mainNavigation = screen.getByRole("navigation", {
          name: /main navigation/i,
        });

        // It does not render the navigation in a loading state
        expect(mainNavigation).toHaveAttribute("aria-busy", "false");

        // Open all sub navigation nodes
        userEvent.click(
          within(mainNavigation).getByRole("button", {
            name: PreviewDisabled.args.navItems[1].name,
          })
        );

        userEvent.click(
          within(mainNavigation).getByRole("button", {
            name: PreviewDisabled.args.navItems[1].children[2].name,
          })
        );

        // Get all nav links from passed props
        const navLinks = getNavItems(PreviewDisabled.args.navItems);

        // It renders all navigation nodes
        const links = within(mainNavigation).getAllByRole("link");

        links.forEach((link, index) => {
          expect(link).toHaveTextContent(navLinks[index].name);
          expect(link).toHaveAttribute("href", navLinks[index].url);
        });
      });

      test("a user can invoke the search UI using the search button", async () => {
        const onQueryChangeMock = jest.fn();

        render(<PreviewDisabled onQueryChange={onQueryChangeMock} />);

        userEvent.click(screen.getByRole("button", { name: /search site/i }));

        await waitFor(() => {
          expect(screen.getByRole("searchbox")).toBeInTheDocument();
        });
      });

      test("a user can invoke the search UI using the keyboard shortcut", async () => {
        const onQueryChangeMock = jest.fn();

        render(<PreviewDisabled onQueryChange={onQueryChangeMock} />);

        userEvent.type(document.querySelector("body"), "/", {
          skipClick: true,
        });

        await waitFor(() => {
          expect(screen.getByRole("searchbox")).toBeInTheDocument();
        });
      });

      test("a user can perform a search", async () => {
        const onQueryChangeMock = jest.fn();

        render(<PreviewDisabled onQueryChange={onQueryChangeMock} />);

        userEvent.click(screen.getByRole("button", { name: /search site/i }));

        await waitFor(() => {
          expect(screen.getByRole("searchbox")).toBeInTheDocument();
        });

        userEvent.type(screen.getByRole("searchbox"), "test query");

        await waitFor(() => {
          expect(onQueryChangeMock).toHaveBeenCalledTimes(1);
        });

        onQueryChangeMock.mockRestore();
      });
    });

    describe("breadcrumb content", () => {
      test("it renders correctly", () => {
        render(<PreviewDisabled />);

        const breadcrumb = screen.getByRole("navigation", {
          name: /breadcrumb/i,
        });

        // The breadcrumb should have the required accesibility attributes
        expect(breadcrumb).toHaveAttribute("aria-busy", "false");

        // It should not render any breadcrumb item placeholders
        expect(
          within(breadcrumb).queryAllByLabelText(/breadcrumb item placeholder/i)
        ).toHaveLength(0);

        const breadcrumbLinks = within(breadcrumb).getAllByRole("link");

        // It should render all breadcrumb links with correct URLs
        expect(breadcrumbLinks).toHaveLength(
          PreviewDisabled.args.breadcrumbLinks.length
        );

        breadcrumbLinks.forEach((link, index) => {
          expect(link).toHaveTextContent(
            PreviewDisabled.args.breadcrumbLinks[index].label
          );
          expect(link).toHaveAttribute(
            "href",
            PreviewDisabled.args.breadcrumbLinks[index].url
          );
        });

        // It renders the current page as static text
        expect(
          within(breadcrumb).getByText(PreviewDisabled.args.pageTitle)
        ).toBeInTheDocument();
      });
    });

    describe("related knowledge content", () => {
      test("with links, it renders correctly", () => {
        render(<PreviewDisabled />);

        const relatedKnowledge = screen.getByRole("navigation", {
          name: /related knowledge/i,
        });

        const toggleRelatedKnowledgeBtn = within(relatedKnowledge).getByRole(
          "button"
        );

        // The menu should have the required accesibility attributes
        expect(relatedKnowledge).toHaveAttribute("aria-busy", "false");

        // It is initially rendered in a collapsed state
        expect(within(relatedKnowledge).queryAllByRole("link")).toHaveLength(0);
        expect(toggleRelatedKnowledgeBtn).toHaveAccessibleName(/expand menu/i);

        // Expand the menu
        userEvent.click(toggleRelatedKnowledgeBtn);

        // It reveals all knowldge links
        const knowledgeLinks = within(relatedKnowledge).getAllByRole("link");

        expect(knowledgeLinks).toHaveLength(
          PreviewDisabled.args.relatedKnowledge.length
        );

        knowledgeLinks.forEach((link, index) => {
          expect(link).toHaveTextContent(
            PreviewDisabled.args.relatedKnowledge[index].label
          );
          expect(link).toHaveAttribute(
            "href",
            PreviewDisabled.args.relatedKnowledge[index].url
          );
        });
      });

      test("with no links, it does not render the menu", () => {
        render(<PreviewDisabled relatedKnowledge={null} />);

        expect(
          screen.queryByRole("navigation", {
            name: /related knowledge/i,
          })
        ).not.toBeInTheDocument();
      });
    });

    describe("table of contents content", () => {
      test("with headers, it renders correctly", async () => {
        const bodyContent = `# Heading One \n## Heading Two`;

        render(<PreviewDisabled {...{ bodyContent }} />);

        const tocs = screen.queryByRole("navigation", {
          name: /table of contents/i,
        });

        const tocLinks = within(tocs).getAllByRole("link");

        expect(tocLinks).toHaveLength(2);

        tocLinks.forEach((link) => {
          expect(link).toHaveTextContent(/heading/i);
          expect(link).toHaveAttribute("href", expect.stringContaining("#h-"));
        });
      });

      test("with no headers, it does not render the table of contents", () => {
        render(<PreviewDisabled bodyContent="" />);

        expect(
          screen.queryByRole("navigation", {
            name: /table of contents/i,
          })
        ).not.toBeInTheDocument();
      });
    });

    describe("main content", () => {
      test("it renders correctly", () => {
        const bodyContent = "Test body content";

        render(<PreviewDisabled {...{ bodyContent }} />);

        const renderedBodyContent = screen.getByText(bodyContent);

        // It renders the body content
        expect(renderedBodyContent).toBeInTheDocument();

        // It does not allow the body content to be edited
        expect(renderedBodyContent.parentNode).toHaveAttribute(
          "contenteditable",
          "false"
        );
      });
    });

    describe("preview mode controller", () => {
      test("it renders correctly", () => {
        render(<PreviewDisabled />);

        const enablePreviewBtn = screen.getByRole("button", {
          name: /enable preview mode/i,
        });

        // It renders the enable preview mode button
        expect(enablePreviewBtn).toBeInTheDocument();

        // The enable preview mode button is not disabled
        expect(enablePreviewBtn).not.toBeDisabled();

        // It does not render the branch switcher
        expect(
          screen.queryByRole("button", { name: /switch working branch/i })
        ).not.toBeInTheDocument();

        // It does not render the branch creator
        expect(
          screen.queryByRole("button", { name: /create branch/i })
        ).not.toBeInTheDocument();

        // It does not render the knowledge page creator button
        expect(
          screen.queryByRole("button", { name: /create knowledge/i })
        ).not.toBeInTheDocument();

        // It does not render the knowledge meta data editor button
        expect(
          screen.queryByRole("button", { name: /edit knowledge/i })
        ).not.toBeInTheDocument();

        // It does not render the commit changes button
        expect(
          screen.queryByRole("button", { name: /commit changes/i })
        ).not.toBeInTheDocument();

        // It does not render the pull request button
        expect(
          screen.queryByRole("button", { name: /create pull request/i })
        ).not.toBeInTheDocument();
      });

      test("it correctly handles requests to enable preview mode", () => {
        const onTogglePreviewModeMock = jest.fn();

        render(
          <PreviewDisabled onTogglePreviewMode={onTogglePreviewModeMock} />
        );

        userEvent.click(
          screen.getByRole("button", {
            name: /enable preview mode/i,
          })
        );

        expect(onTogglePreviewModeMock).toHaveBeenCalledTimes(1);

        onTogglePreviewModeMock.mockRestore();
      });
    });
  });

  describe("in a loading state", () => {
    describe("main header content", () => {
      test("it renders correctly", async () => {
        render(<Loading />);

        const logo = screen.getByRole("img", {
          name: Loading.args.siteTitle,
        });

        // It renders the logo to the document
        expect(logo).toBeInTheDocument();

        // It renders a link to the homepage
        const homeLink = screen.getByRole("link", {
          name: Loading.args.siteTitle,
        });

        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute("href", "/");

        userEvent.click(
          screen.queryByRole("button", { name: /open navigation/i })
        );

        // It renders the site title
        await waitFor(() => {
          expect(
            screen.getByRole("heading", {
              name: Loading.args.siteTitle,
            })
          ).toBeInTheDocument();
        });

        // It renders the site version
        expect(screen.getByText(Loading.args.version)).toBeInTheDocument();

        // It should not render the main navigation
        expect(
          screen.queryByRole("navigation", { name: /main navigation/i })
        ).not.toBeInTheDocument();
      });

      test("a user can not invoke the search UI using the search button", async () => {
        const onQueryChangeMock = jest.fn();

        render(<Loading onQueryChange={onQueryChangeMock} />);

        expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
      });

      test("a user can not invoke the search UI using the keyboard shortcut", async () => {
        const onQueryChangeMock = jest.fn();

        render(<Loading onQueryChange={onQueryChangeMock} />);

        userEvent.type(document.querySelector("body"), "/", {
          skipClick: true,
        });

        await waitFor(() => {
          expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
        });
      });
    });

    describe("breadcrumb content", () => {
      test("it renders correctly", () => {
        render(<Loading />);

        const breadcrumb = screen.getByRole("navigation", {
          name: /breadcrumb/i,
        });

        // It sets the correct accesibility attributes
        expect(breadcrumb).toHaveAttribute("aria-busy", "true");

        // It should not render any breadcrumb links
        expect(within(breadcrumb).queryAllByRole("link")).toHaveLength(0);

        // It should not render the page title within the breadcrumb links
        expect(
          within(breadcrumb).queryByText(Loading.args.pageTitle)
        ).not.toBeInTheDocument();
      });
    });

    describe("related knowledge content", () => {
      test("it renders corectly", () => {
        render(<Loading />);

        // It does not render a related knowledge menu
        expect(
          screen.queryByRole("navigation", { name: /related knowledge/i })
        ).not.toBeInTheDocument();
      });
    });

    describe("table of contents content", () => {
      test("it renders correctly", () => {
        render(<Loading />);

        // It does not render a table of contents
        expect(
          screen.queryByRole("navigation", {
            name: /table of contents/i,
          })
        ).not.toBeInTheDocument();
      });
    });

    describe("main content", () => {
      test("it renders correctly", () => {
        const bodyContent = "Test body content";

        render(<Loading {...{ bodyContent }} />);

        // It does not render the body content
        expect(screen.queryByText(bodyContent)).not.toBeInTheDocument();
      });
    });

    describe("preview mode controller", () => {
      test("it renders correctly", () => {
        render(<Loading />);

        // It does not render the enable preview mode button
        expect(
          screen.queryByRole("button", {
            name: /enable preview mode/i,
          })
        ).not.toBeInTheDocument();

        // It does not render the branch switcher
        expect(
          screen.queryByRole("button", { name: /switch working branch/i })
        ).not.toBeInTheDocument();

        // It does not render the branch creator
        expect(
          screen.queryByRole("button", { name: /create branch/i })
        ).not.toBeInTheDocument();

        // It does not render the knowledge page creator button
        expect(
          screen.queryByRole("button", { name: /create knowledge/i })
        ).not.toBeInTheDocument();

        // It does not render the knowledge meta data editor button
        expect(
          screen.queryByRole("button", { name: /edit knowledge/i })
        ).not.toBeInTheDocument();

        // It does not render the commit changes button
        expect(
          screen.queryByRole("button", { name: /commit changes/i })
        ).not.toBeInTheDocument();

        // It does not render the pull request button
        expect(
          screen.queryByRole("button", { name: /create pull request/i })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("with preview mode enabled", () => {});
});
