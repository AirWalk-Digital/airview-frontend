/* eslint jest/expect-expect: 0 */
import React from "react";
import { render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/applications-template/applications-template.stories";

const { Loading, PreviewDisabled, PreviewEnabled } = composeStories(stories);

describe("ApplicationsTemplate", () => {
  test("in a loading state, it renders without error", () => {
    render(<Loading />);
  });

  test("in a loaded state, with data preview disabled, it renders without error", () => {
    render(<PreviewDisabled />);
  });

  test("in a loaded state, with preview enabled, it renders without error", () => {
    render(<PreviewEnabled />);
  });
});
