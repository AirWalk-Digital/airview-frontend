import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/pull-request-creator/pull-request-creator.stories";

const { WithSubmissionSuccess, WithSubmissionError } = composeStories(stories);

describe("PullRequestCreator", () => {
  test("a user can create a pull request", async () => {
    const onSubmitSpy = jest.spyOn(WithSubmissionSuccess.args, "onSubmit");

    const { container } = render(<WithSubmissionSuccess />);

    await WithSubmissionSuccess.play({ canvasElement: container });

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith("development", "main");

      const viewPRButton = screen.getByRole("button", {
        name: /view pull request/i,
      });

      expect(viewPRButton).toBeInTheDocument();
      expect(viewPRButton).toHaveAttribute("href", "https://github.com");
    });
  });

  test("a user is alerted to an error when thrown", async () => {
    const { container } = render(<WithSubmissionError />);

    await WithSubmissionError.play({ canvasElement: container });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: /view pull request/i,
        })
      ).not.toBeInTheDocument();
    });
  });
});
