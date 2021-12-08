/* eslint jest/expect-expect: 0 */
import React from "react";
import { render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/applications-index-template/applications-index-template.stories";

const {
  Loading,
  WithEnvironmentData,
  WithoutEnvironmentData,
  WithoutRequiredPermissions,
} = composeStories(stories);

describe("ApplicationsIndexTemplate", () => {
  test("in a loading state, it renders without error", () => {
    render(<Loading />);
  });

  test("in a loaded state, with data, it renders without error", () => {
    render(<WithEnvironmentData />);
  });

  test("in a loaded state, with no data, it renders without error", () => {
    render(<WithoutEnvironmentData />);
  });

  test("in a loaded state, without required permissions, it renders without error", () => {
    render(<WithoutRequiredPermissions />);
  });
});
