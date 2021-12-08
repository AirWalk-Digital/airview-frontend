/* eslint jest/expect-expect: 0 */

import React from "react";
import { render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/homepage-template/homepage-template.stories";

const { Loaded, Loading } = composeStories(stories);

describe("HomepageTemplate", () => {
  test("in a loading state, it renders without error", () => {
    render(<Loading />);
  });

  test("in a loaded state, it renders without error", () => {
    render(<Loaded />);
  });
});
