import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/page-section-creator/page-section-creator.stories";

const { WithSubmissionSuccess, WithSubmissionError } = composeStories(stories);

describe("PageSectionCreator", () => {
  test("a user can create a new page section", async () => {
    const onSubmitSpy = jest.spyOn(WithSubmissionSuccess.args, "onSubmit");

    const { container } = render(<WithSubmissionSuccess />);

    await WithSubmissionSuccess.play({ canvasElement: container });

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith("Test Page Section");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    onSubmitSpy.mockRestore();
  });

  test("a user is alerted to an error, if thrown", async () => {
    const { container } = render(<WithSubmissionError />);

    await WithSubmissionError.play({ canvasElement: container });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
