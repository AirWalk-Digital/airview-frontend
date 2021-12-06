import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "../stories/branch-switcher/branch-switcher.stories";

const { WithSuccess, WithError } = composeStories(stories);

describe("BranchSwitcher", () => {
  test("a user can switch working branch", async () => {
    const onSubmitSpy = jest.spyOn(WithSuccess.args, "onSubmit");

    const { container } = render(<WithSuccess />);

    await WithSuccess.play({ canvasElement: container });

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith(expect.any(String));
    });

    onSubmitSpy.mockRestore();
  });

  test("a user is alerted to an error, if thrown", async () => {
    const onSubmitSpy = jest.spyOn(WithError.args, "onSubmit");

    const { container } = render(<WithError />);

    await WithError.play({ canvasElement: container });

    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith(expect.any(String));
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    onSubmitSpy.mockRestore();
  });
});
