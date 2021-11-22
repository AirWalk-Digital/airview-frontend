import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/accordion-menu/accordion-menu.stories";

const { Loading, Loaded, LoadedWithCollapsedBreadcrumbs } = composeStories(
  stories
);

describe("Breadcrumb", () => {
  test.todo("in a loading state, it renders correctly");

  test.todo("in a loaded state, it renders correctly");

  test.todo("in a collapsed state, it renders correctly");

  test.todo("a user can reveal collapsed breadcrumbs");

  test.todo("it should spread other props to the component root DOM node");
});
