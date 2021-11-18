import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AccordionMenu } from "../../components/accordion-menu";
import { LocationProvider } from "../../hooks/use-location";

const config = {
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

const testNavItems = [
  {
    id: "1",
    name: "Navigation Item 1",
    url: "/one",
  },
  {
    id: "2",
    name: "Navigation Item Parent 1",
    children: [
      {
        id: "3",
        name: "Sub Navigation Item 1",
        url: "/two",
      },
      {
        id: "4",
        name: "Sub Navigation Item 2",
        url: "/three",
      },
      {
        id: "5",
        name: "Navigation Item Parent 2",
        children: [
          {
            id: "6",
            name: "Sub Navigation Item 1",
            url: "/four",
          },
          {
            id: "7",
            name: "Sub Navigation Item 2",
            url: "/five",
          },
        ],
      },
      {
        id: "6",
        name: "Sub Navigation Item 3",
        url: "/six",
      },
      {
        id: "7",
        name: "Sub Navigation Item 4",
        url: "/seven",
      },
    ],
  },
  {
    id: "8",
    name: "Navigation Item 2",
    url: "/eight",
  },
  {
    id: "9",
    name: "Navigation Item 3",
    url: "/nine",
  },
];

function Template(args) {
  return (
    <LocationProvider location="/seven">
      <AccordionMenu {...args} />
    </LocationProvider>
  );
}

Template.args = {
  menuTitle: "Menu Title",
  loading: false,
  navItems: [...testNavItems],
  id: "accordion-nav",
};

const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
  loading: true,
};

const LoadedWithTitle = Template.bind({});
LoadedWithTitle.args = {
  ...Template.args,
  loading: false,
};

const LoadedWithoutTitle = Template.bind({});

LoadedWithoutTitle.args = {
  ...Template.args,
  menuTitle: null,
  loading: false,
};

export { Loading, LoadedWithTitle, LoadedWithoutTitle };

export default config;
