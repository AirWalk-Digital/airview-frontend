import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/knowledge-page-meta-editor/knowledge-page-meta-editor.stories";
import dayjs from "dayjs";

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
          title: "Test Knowledge Page Amended",
          reviewDate: expect.stringContaining(
            dayjs().add(2, "day").format("YYYY-MM-DD")
          ),
          userFacing: false,
        })
      );
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
