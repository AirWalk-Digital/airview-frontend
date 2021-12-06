import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/knowledge-page-meta-editor/knowledge-page-meta-editor.stories";

const { WithSubmissionSuccess, WithSubmissionError } = composeStories(stories);

describe("KnowledgePageMetaEditor", () => {
  test("a user can edit Knowledge Page meta data", async () => {
    const onSubmitSpy = jest.spyOn(WithSubmissionSuccess.args, "onSubmit");

    const { container } = render(<WithSubmissionSuccess />);

    await WithSubmissionSuccess.play({ canvasElement: container });

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          reviewDate: expect.any(String),
          userFacing: expect.any(Boolean),
        })
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    onSubmitSpy.mockRestore();
  });

  test("a user is alerted to an error, if thrown", async () => {
    const onSubmitSpy = jest.spyOn(WithSubmissionError.args, "onSubmit");

    const { container } = render(<WithSubmissionError />);

    await WithSubmissionError.play({ canvasElement: container });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    onSubmitSpy.mockRestore();
  });
});
