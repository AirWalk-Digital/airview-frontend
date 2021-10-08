import React from "react";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../components/progress-bar";

describe("ProgressBar - default render", () => {
  beforeEach(() => {
    render(<ProgressBar value={50} />);
  });

  it("should indicate the progress value via an aria-label", () => {
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50"
    );
  });

  it("should indicate the progress value via an label", () => {
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should render the progress bar as determinate variant", () => {
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuemin",
      "0"
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50"
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuemax",
      "100"
    );
  });
});

describe("ProgressBar - with showLabel prop set to true", () => {
  beforeEach(() => {
    render(<ProgressBar value={50} showLabel={true} />);
  });

  it("should output the progress label equal to the value of the value prop", () => {
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});

describe("ProgressBar - with showLabel prop set to false", () => {
  beforeEach(() => {
    render(<ProgressBar value={50} showLabel={false} />);
  });

  it("should not output the progress value label", () => {
    expect(screen.queryByText("50%")).toBeNull();
  });
});

describe("ProgressBar - with variant prop set to determinate", () => {
  beforeEach(() => {
    render(<ProgressBar value={50} showLabel={true} variant="determinate" />);
  });

  it("should render the progress bar as determinate variant", () => {
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuemin",
      "0"
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50"
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuemax",
      "100"
    );
  });
});

describe("ProgressBar - with variant prop set to indeterminate", () => {
  beforeEach(() => {
    render(
      <ProgressBar value={50} showLabel={false} variant="indeterminate" />
    );
  });

  it("should render the progress bar as indeterminate variant", () => {
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuemin"
    );

    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow"
    );

    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuemax"
    );
  });
});

describe("ProgressBar - with value pased to ariaLabel prop", () => {
  beforeEach(() => {
    render(<ProgressBar value={50} ariaLabel="Test label" />);
  });

  it("should render an aria label equal to the value passed to the ariaLabel prop", () => {
    expect(screen.getByLabelText("Test label")).toBeInTheDocument();
  });
});

describe("ProgressBar - with value pased to classNames prop", () => {
  it("should apply classnames equal to the value passed to the classNames prop", () => {
    const { container } = render(
      <ProgressBar value={50} classNames="testClass" />
    );
    expect(container.firstChild.className).toEqual(
      expect.stringContaining("testClass")
    );
  });
});
