import React from "react";
import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/message/message.stories";
import { Message } from "../components/message";

const { Default } = composeStories(stories);

describe("Message", () => {
  test("it renders correctly", () => {
    render(<Default />);

    expect(screen.getByText(Default.args.title)).toBeInTheDocument();
    expect(screen.getByText(Default.args.message)).toBeInTheDocument();
  });

  test("it should allow the forwardind of a ref", () => {
    const ref = React.createRef();
    const testId = "ref-test-id";

    render(<Message ref={ref} data-testid={testId} />);

    expect(ref.current.getAttribute("data-testid")).toBe(testId);
  });

  test("it should spread other props to the component root DOM node", () => {
    const testClassName = "test-classname";

    const { container } = render(<Message className={testClassName} />);

    expect(container.firstChild).toHaveClass(testClassName);
  });
});
