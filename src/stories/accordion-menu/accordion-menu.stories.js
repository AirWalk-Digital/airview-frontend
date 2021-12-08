import React from "react";
import { userEvent, within } from "@storybook/testing-library";
import { makeStyles } from "@material-ui/core/styles";
import { AccordionMenu } from "../../components/accordion-menu";

export default {
  title: "Modules/Accordion Menu",
  component: AccordionMenu,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        root: {
          width: 320,
          margin: "0 auto",
        },
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

function Template(args) {
  return <AccordionMenu {...args} />;
}

Template.args = {
  id: "accordion-nav",
};

export const Loading = {
  ...Template,
  args: {
    ...Template.args,
    menuTitle: "",
    navItems: [],
    loading: true,
  },
};

export const Loaded = {
  ...Template,
  args: {
    ...Template.args,
    menuTitle: "Menu Title",
    navItems: [
      {
        id: "1",
        name: "Navigation Item 1",
        url: "/",
      },
      {
        id: "2",
        name: "Navigation Item 2 - Parent",
        children: [
          {
            id: "3",
            name: "Child Navigation Item 2:1",
            url: "/",
          },
          {
            id: "4",
            name: "Child Navigation Item 2:2",
            url: "/",
          },
          {
            id: "5",
            name: "Child Navigation Item 2:3 - Parent",
            children: [
              {
                id: "6",
                name: "Child Navigation Item 3:1",
                url: "/",
              },
              {
                id: "7",
                name: "Child Navigation Item 3:2",
                url: "/",
              },
            ],
          },
          {
            id: "6",
            name: "Child Navigation Item 2:4",
            url: "/",
          },
          {
            id: "7",
            name: "Child Navigation Item 2:5",
            url: "/",
          },
        ],
      },
      {
        id: "8",
        name: "Navigation Item 3",
        url: "/",
      },
      {
        id: "9",
        name: "Navigation Item 4",
        url: "/",
      },
    ],
    loading: false,
  },
};

export const LoadedExpanded = {
  ...Loaded,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", {
        name: /navigation item 2 - parent/i,
      })
    );

    await userEvent.click(
      await canvas.findByRole("button", {
        name: /child navigation item 2:3 - parent/i,
      })
    );
  },
};
