import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/application-creator/application-creator.stories";

const { WithSubmissionSuccess, WithSubmissionError } = composeStories(stories);

describe("ApplicationCreator", () => {
  test("a user can create a new application", async () => {
    const onSubmitSpy = jest.spyOn(WithSubmissionSuccess.args, "onSubmit");

    const { container } = render(<WithSubmissionSuccess />);

    await WithSubmissionSuccess.play({ canvasElement: container });

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);

      expect(onSubmitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          applicationTypeId: expect.any(Number),
          environmentId: expect.any(Number),
          name: expect.any(String),
          parentId: expect.any(Number),
          references: expect.arrayContaining([
            expect.objectContaining({
              reference: expect.any(String),
              type: expect.any(String),
            }),
          ]),
        })
      );
    });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );

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
