import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./utils/with-providers";
import { AccordionMenu } from "../components/accordion-menu";

const testNavItems = [
  {
    id: "1",
    name: "Navigation Item 1",
    url: "one",
  },
  {
    id: "2",
    name: "Navigation Item Parent 1",
    children: [
      {
        id: "3",
        name: "Sub Navigation A Item 1",
        url: "two",
      },
      {
        id: "4",
        name: "Sub Navigation A Item 2",
        url: "three",
      },
      {
        id: "5",
        name: "Navigation Item Parent 2",
        children: [
          {
            id: "6",
            name: "Sub Navigation B Item 1",
            url: "four",
          },
          {
            id: "7",
            name: "Sub Navigation B Item 2",
            url: "five",
          },
        ],
      },
      {
        id: "6",
        name: "Sub Navigation A Item 3",
        url: "six",
      },
      {
        id: "7",
        name: "Sub Navigation A Item 4",
        url: "seven",
      },
    ],
  },
  {
    id: "8",
    name: "Navigation Item 2",
    url: "eight",
  },
  {
    id: "9",
    name: "Navigation Item 3",
    url: "nine",
  },
];

describe("AccordionMenu - menu title", () => {
  describe("with a menuTitle prop set", () => {
    it("should output a title equal to the value of the menuTitle prop", () => {
      renderWithProviders(
        <AccordionMenu
          menuTitle="Menu Title"
          navItems={[...testNavItems]}
          testid="testid"
        />
      );

      expect(screen.getByLabelText("Menu title")).toHaveTextContent(
        /^Menu Title$/
      );
    });
  });

  describe("with no menuTitle prop set", () => {
    it("should not output a title", () => {
      renderWithProviders(
        <AccordionMenu navItems={[...testNavItems]} testid="testid" />
      );

      expect(screen.queryByLabelText("Menu title")).toBeNull();
    });
  });
});

describe("AccordionMenu - menu items", () => {
  beforeEach(() => {
    renderWithProviders(
      <AccordionMenu
        menuTitle="Menu Title"
        navItems={[...testNavItems]}
        testid="testid"
      />
    );
  });

  it("should render all menu items equal to the order of the passed array", () => {
    const menuItems = screen.getAllByLabelText("Menu item label");
    const subMenuItems = screen.getAllByLabelText("Sub-menu");

    expect(menuItems[0]).toHaveTextContent(/^Navigation Item 1$/);
    expect(menuItems[1]).toHaveTextContent(/^Navigation Item 2$/);
    expect(menuItems[2]).toHaveTextContent(/^Navigation Item 3$/);

    expect(subMenuItems[0]).toHaveTextContent(/^Navigation Item Parent 1$/);
  });
});

describe("AccordionMenu - sub menus", () => {
  beforeEach(() => {
    renderWithProviders(
      <AccordionMenu
        menuTitle="Menu Title"
        navItems={[...testNavItems]}
        testid="testid"
      />
    );
  });

  it("should not render sub navigation items by default", () => {
    const menuItems = screen.getAllByLabelText("Menu item label");

    expect(menuItems).toHaveLength(3);
  });

  it("should show a given sub navigation when a request to reveal a sub navigation is made", () => {
    userEvent.click(
      screen.getByLabelText("Sub-menu", { name: "Navigation Item Parent 1" })
    );

    const menuItems = screen.getAllByLabelText("Menu item label");

    expect(menuItems).toHaveLength(7);
    expect(menuItems[0]).toHaveTextContent(/^Navigation Item 1$/);
    expect(menuItems[1]).toHaveTextContent(/^Sub Navigation A Item 1$/);
    expect(menuItems[2]).toHaveTextContent(/^Sub Navigation A Item 2$/);
    expect(menuItems[3]).toHaveTextContent(/^Sub Navigation A Item 3$/);
    expect(menuItems[4]).toHaveTextContent(/^Sub Navigation A Item 4$/);
    expect(menuItems[5]).toHaveTextContent(/^Navigation Item 2$/);
    expect(menuItems[6]).toHaveTextContent(/^Navigation Item 3$/);
  });

  it("should hide a given sub navigation when a request to reveal a sub navigation is made", async () => {
    const subMenuItem = screen.getByLabelText("Sub-menu", {
      name: "Navigation Item Parent 1",
    });

    userEvent.click(subMenuItem);
    expect(screen.queryByText("Sub Navigation A Item 1")).toBeInTheDocument();

    userEvent.click(subMenuItem);

    await waitFor(() => {
      expect(
        screen.queryByText("Sub Navigation A Item 1")
      ).not.toBeInTheDocument();
    });
  });
});
