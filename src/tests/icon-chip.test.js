import React from "react";
import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/icon-chip/icon-chip.stories";
import { IconChip } from "../components/icon-chip";

const { Default } = composeStories(stories);

describe("IconChip", () => {
  test("it renders correctly", () => {
    const iconPropNode = "icon prop node";
    render(<Default icon={<span>{iconPropNode}</span>} />);

    // It renders the node passed to the icon prop
    expect(screen.getByText(iconPropNode)).toBeInTheDocument();

    // It renders the label
    expect(screen.getByText(Default.args.label)).toBeInTheDocument();
  });

  test("it should allow the forwardind of a ref", () => {
    const ref = React.createRef();
    const testId = "ref-test-id";

    render(<IconChip ref={ref} data-testid={testId} />);

    expect(ref.current.getAttribute("data-testid")).toBe(testId);
  });

  test("it should spread other props to the component root DOM node", () => {
    const testClassName = "test-classname";

    const { container } = render(<Default className={testClassName} />);

    expect(container.firstChild).toHaveClass(testClassName);
  });
});
