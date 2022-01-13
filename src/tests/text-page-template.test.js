/* eslint jest/expect-expect: 0 */
import React from "react";
import { render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/text-page-template/text-page-template.stories";

const { Loading, LoadedPreviewDisabled, LoadedPreviewEnabled } = composeStories(
  stories
);

describe("TextPageTemplate", () => {
  test("in a loading state, it renders without error", () => {
    render(<Loading />);
  });

  test("in a loaded state, with preview mode disabled, it renders without error", () => {
    render(<LoadedPreviewDisabled />);
  });

  test("in a loaded state, with preview mode enabled, it renders without error", () => {
    render(<LoadedPreviewEnabled />);
  });
});
