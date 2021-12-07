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
          applicationTypeId: 1,
          environmentId: 1,
          name: "Test application name",
          parentId: 1,
          references: [
            {
              reference: "Test reference label",
              type: "Reference Type One",
            },
          ],
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
