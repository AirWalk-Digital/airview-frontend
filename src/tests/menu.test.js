import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./utils/with-providers";
import { Menu } from "../components/menu";

describe("Menu", () => {
  describe("with no value passed to the collapsible prop", () => {
    it("should default to a collapsible menu", () => {
      renderWithProviders(<Menu menuTitle="Test menu title" menuItems={[]} />);

      expect(screen.getByRole("button", { name: /menu/ })).toBeInTheDocument();
    });
  });

  describe("with a true value passed to the collapsible prop", () => {
    it("should render the collapsible toggle UI", () => {
      renderWithProviders(
        <Menu menuTitle="Test menu title" menuItems={[]} collapsible />
      );

      expect(screen.getByRole("button", { name: /menu/ })).toBeInTheDocument();
    });

    describe("and with no value passed to the initialCollapsed prop", () => {
      beforeEach(() => {
        renderWithProviders(
          <Menu menuTitle="Test menu title" menuItems={[]} collapsible />
        );
      });

      it("should indicate to the user that the menu can be collapsed", () => {
        expect(
          screen.getByRole("button", { name: "Collapse menu" })
        ).toBeInTheDocument();
      });

      it("should not set the menu items to hidden", () => {
        expect(screen.getByRole("list")).toBeInTheDocument();
      });
    });

    describe("and with a true value passed to the initialCollapsed prop", () => {
      beforeEach(() => {
        renderWithProviders(
          <Menu
            menuTitle="Test menu title"
            menuItems={[]}
            collapsible
            initialCollapsed={true}
          />
        );
      });

      it("should indicate to the user that the menu can be expanded", () => {
        expect(
          screen.getByRole("button", { name: "Expand menu" })
        ).toBeInTheDocument();
      });

      it("should set the menu items to hidden", () => {
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
      });
    });

    describe("and with a false value passed to the initialCollapsed prop", () => {
      beforeEach(() => {
        renderWithProviders(
          <Menu
            menuTitle="Test menu title"
            menuItems={[]}
            collapsible
            initialCollapsed={false}
          />
        );
      });

      it("should indicate to the user that the menu can be collapsed", () => {
        expect(
          screen.getByRole("button", { name: "Collapse menu" })
        ).toBeInTheDocument();
      });

      it("should not set the menu items to hidden", () => {
        expect(screen.getByRole("list")).toBeInTheDocument();
      });
    });
  });

  describe("with a false value passed to the collapsible prop", () => {
    beforeEach(() => {
      renderWithProviders(
        <Menu menuTitle="Test menu title" menuItems={[]} collapsible={false} />
      );
    });
    it("should not render the collapsible toggle UI", () => {
      expect(
        screen.queryByRole("button", { name: /menu/ })
      ).not.toBeInTheDocument();
    });

    it("should not set the menu items to hidden", () => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });
  });

  describe("toggling the collpased state of the menu", () => {
    describe("on click of the toggle button, when the menu is expanded", () => {
      beforeEach(() => {
        renderWithProviders(
          <Menu
            menuTitle="Test menu title"
            menuItems={[]}
            collapsible={true}
            initialCollapsed={false}
          />
        );
      });

      it("should hide the menu items", async () => {
        expect(screen.getByRole("list")).toBeInTheDocument();

        userEvent.click(screen.getByRole("button", { name: "Collapse menu" }));

        expect(screen.queryByRole("list")).not.toBeInTheDocument();
      });

      it("should indicate to the user that the menu items can be expanded", async () => {
        expect(
          screen.queryByRole("button", { name: "Expand menu" })
        ).not.toBeInTheDocument();

        userEvent.click(screen.getByRole("button", { name: "Collapse menu" }));

        expect(
          screen.getByRole("button", { name: "Expand menu" })
        ).toBeInTheDocument();
      });
    });

    describe("on click of the toggle button, when the menu is collapsed", () => {
      beforeEach(() => {
        renderWithProviders(
          <Menu
            menuTitle="Test menu title"
            menuItems={[]}
            collapsible={true}
            initialCollapsed={true}
          />
        );
      });

      it("should reveal the menu items", async () => {
        expect(screen.queryByRole("list")).not.toBeInTheDocument();

        userEvent.click(screen.getByRole("button", { name: "Expand menu" }));

        expect(screen.getByRole("list")).toBeInTheDocument();
      });

      it("should indicate to the user that the menu items can be collapsed", async () => {
        expect(
          screen.queryByRole("button", { name: "Collapse menu" })
        ).not.toBeInTheDocument();

        userEvent.click(screen.getByRole("button", { name: "Expand menu" }));

        expect(
          screen.getByRole("button", { name: "Collapse menu" })
        ).toBeInTheDocument();
      });
    });
  });

  describe("with a valid value passed to menuTitle prop", () => {
    it("should output a menu title equal to the value of the menuTitle prop", () => {
      renderWithProviders(<Menu menuTitle="Test menu title" menuItems={[]} />);

      expect(screen.getByText("Test menu title")).toBeInTheDocument();
    });
  });

  describe.each`
    element
    ${"h1"}
    ${"h2"}
    ${"h3"}
    ${"h4"}
    ${"h5"}
    ${"h6"}
  `(
    "with a value of $element passed to the menuTitleElement prop",
    ({ element }) => {
      it(`should output the title using a HTML ${element} tag`, () => {
        renderWithProviders(
          <Menu
            menuTitle="Test menu title"
            menuItems={[]}
            menuTitleElement={element}
          />
        );

        expect(screen.getByText("Test menu title").tagName).toBe(
          element.toUpperCase()
        );
      });
    }
  );

  describe("with no value passed to the menuTitleElement prop", () => {
    it("should output the title using a h6 HTML element tag", () => {
      renderWithProviders(<Menu menuTitle="Test menu title" menuItems={[]} />);

      expect(screen.getByText("Test menu title").tagName).toBe("H6");
    });
  });

  describe("with an array of menuItems greater than one passed to the menuItems prop", () => {
    beforeEach(() => {
      renderWithProviders(
        <Menu
          menuItems={[
            {
              label: "Menu item one - internal",
              url: "/one",
            },
            {
              label: "Menu item two - external",
              url: "https://www.testurl.com/",
              externalLink: true,
            },
            {
              label: "Menu item three - internal current item",
              url: "/three",
              currentMenuItem: true,
            },
          ]}
        />
      );
    });

    it("should output menu items equal to the count of the value passed to the menuItems prop", () => {
      expect(screen.getAllByRole("listitem").length).toBe(3);
    });

    it("should output the list items in the same order as they are passed", () => {
      const listItems = screen.getAllByRole("listitem");

      expect(listItems[0]).toHaveTextContent(/^Menu item one - internal$/);
      expect(listItems[1]).toHaveTextContent(/^Menu item two - external$/);
      expect(listItems[2]).toHaveTextContent(
        /^Menu item three - internal current item$/
      );
    });

    it("should output the correct url value for each menuItem link", () => {
      const listItems = screen.getAllByRole("link");

      expect(listItems[0]).toHaveAttribute("href", "/one");
      expect(listItems[1]).toHaveAttribute("href", "https://www.testurl.com/");
      expect(listItems[2]).toHaveAttribute("href", "/three");
    });
  });

  describe("with menuItem external link value set to a falsy value", () => {
    beforeEach(() => {
      renderWithProviders(
        <Menu
          menuItems={[
            {
              label: "External Link",
              url: "#",
              externalLink: false,
            },
          ]}
        />
      );
    });

    it("should not set a link target", () => {
      expect(screen.getByText("External Link")).not.toHaveAttribute("target");
    });

    it("should not set a link 'rel' attribute", () => {
      expect(screen.getByText("External Link")).not.toHaveAttribute("rel");
    });
  });

  describe("with menuItem external link prop set to true", () => {
    beforeEach(() => {
      renderWithProviders(
        <Menu
          menuItems={[
            {
              label: "External Link",
              url: "https://somedomain.com",
            },
          ]}
        />
      );
    });

    it("should set a link target equal to '_blank'", () => {
      expect(screen.getByText("External Link")).toHaveAttribute(
        "target",
        "_blank"
      );
    });

    it("should set the link rel attribute to 'noreferrer'", () => {
      expect(screen.getByText("External Link")).toHaveAttribute(
        "rel",
        "noreferrer"
      );
    });
  });

  describe("with classnames passed to the classNames prop", () => {
    it("should apply the passed classnames to the root component node", () => {
      const { container } = renderWithProviders(
        <Menu
          menuTitle="Test menu title"
          menuItems={[]}
          classNames="test-css-classname"
        />
      );

      expect(container.firstChild).toHaveClass("test-css-classname");
    });
  });
});
