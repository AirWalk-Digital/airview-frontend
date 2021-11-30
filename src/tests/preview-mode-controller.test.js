import React from "react";
import {
  render,
  screen,
  within,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { composeStories } from "@storybook/testing-react";
import faker from "faker";
import MockDate from "mockdate";
import dayjs from "dayjs";
import * as stories from "../stories/preview-mode-controller/preview-mode-controller.stories";

const { Loading, Inactive, Active, ActiveWithErrors } = composeStories(stories);

describe("PreviewModeController", () => {
  test("a user can disable preview mode", () => {
    const onToggleSpy = jest.spyOn(Active.args, "onToggle");

    render(<Active />);

    userEvent.click(
      screen.getByRole("button", { name: /disable preview mode/i })
    );

    expect(onToggleSpy).toHaveBeenCalled();

    onToggleSpy.mockClear();
  });
});

describe("BranchSwitcher", () => {
  const setupBranchSwitcherComponent = (branch, submit = true) => {
    userEvent.click(
      screen.getByRole("button", { name: /switch working branch/i })
    );

    const dialog = screen.getByRole("dialog", {
      name: /switch working branch/i,
    });

    const selectedBranch = within(dialog).getByRole("button", {
      name: /working branch/i,
    });

    userEvent.click(selectedBranch);

    userEvent.click(
      screen.getByRole("option", {
        name: new RegExp(branch, "i"),
      })
    );

    if (submit) {
      userEvent.click(
        within(dialog).getByRole("button", { name: /change branch/i })
      );
    }

    return { dialog };
  };

  test("it allows a user to make a request to switch branch", async () => {
    const onBranchSwitchSpy = jest.spyOn(
      Active.args.branchSwitcherArgs,
      "onSubmit"
    );

    render(<Active />);

    setupBranchSwitcherComponent(Active.args.branches[0].name);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: new RegExp(Active.args.branches[0].name, "i"),
      })
    ).toHaveAttribute("aria-disabled", "true");

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();

    expect(
      screen.getByRole("button", { name: /working, please wait.../i })
    ).toBeDisabled();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog", { name: /switch working branch/i })
    );

    expect(onBranchSwitchSpy).toHaveBeenCalledWith(
      expect.stringMatching(Active.args.branches[0].name)
    );

    onBranchSwitchSpy.mockRestore();
  });

  test("it allows a user to cancel a branch switch request", async () => {
    render(<Active />);

    setupBranchSwitcherComponent(Active.args.branches[0].name, false);

    userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog", { name: /switch working branch/i })
    );
  });

  test("it resets the form inputs to default values when the dialog is dismissed", async () => {
    render(<Active />);

    setupBranchSwitcherComponent(Active.args.branches[0].name);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog", { name: /switch working branch/i })
    );

    userEvent.click(
      screen.getByRole("button", { name: /switch working branch/i })
    );

    const dialog = screen.getByRole("dialog", {
      name: /switch working branch/i,
    });

    const selectedBranch = within(dialog).getByRole("button", {
      name: /working branch/i,
    });

    expect(selectedBranch).toHaveTextContent(Active.args.workingBranch);
  });

  test("it prevents a user requesting a branch switch when the selected branch is equal to the working branch", () => {
    render(<Active />);

    const { dialog } = setupBranchSwitcherComponent(
      Active.args.workingBranch,
      false
    );

    expect(
      within(dialog).getByRole("button", { name: /change branch/i })
    ).toBeDisabled();
  });

  test("it handles errors correctly", async () => {
    render(<ActiveWithErrors />);

    setupBranchSwitcherComponent(ActiveWithErrors.args.branches[0].name);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    const selectedBranch = screen.getByRole("button", {
      name: new RegExp(ActiveWithErrors.args.branches[0].name, "i"),
    });

    expect(selectedBranch).toBeInTheDocument();

    expect(selectedBranch).not.toHaveAttribute("aria-disabled", "true");

    expect(screen.getByRole("button", { name: /cancel/i })).not.toBeDisabled();

    expect(
      screen.getByRole("button", { name: /change branch/i })
    ).not.toBeDisabled();

    userEvent.click(screen.getByRole("button", { name: /change branch/i }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});

describe("BranchCreator", () => {
  const setupBranchCreatorComponent = (
    branchName,
    submit = false,
    cancel = false
  ) => {
    userEvent.click(screen.getByRole("button", { name: /create branch/i }));

    const dialog = screen.getByRole("dialog", {
      name: /create branch/i,
    });

    const branchNameInput = within(dialog).getByRole("textbox", {
      name: /branch name/i,
    });

    userEvent.type(branchNameInput, branchName);

    const createButton = within(dialog).getByRole("button", {
      name: /create/i,
    });

    const cancelButton = within(dialog).getByRole("button", {
      name: /cancel/i,
    });

    if (submit) {
      userEvent.click(createButton);
    }

    if (cancel) {
      userEvent.click(cancelButton);
    }

    return { dialog, branchNameInput, createButton, cancelButton };
  };

  test("it allows a user to make a request to create a new branch", async () => {
    const onBranchCreateSpy = jest.spyOn(
      Active.args.branchCreatorArgs,
      "onSubmit"
    );

    render(<Active />);

    const branchName = faker.git.branch();

    const {
      dialog,
      branchNameInput,
      createButton,
      cancelButton,
    } = setupBranchCreatorComponent(branchName, true);

    expect(within(dialog).getByRole("progressbar")).toBeInTheDocument();

    expect(branchNameInput).toBeDisabled();

    expect(cancelButton).toBeDisabled();

    expect(createButton).toBeDisabled();

    expect(createButton).toHaveTextContent(/working/i);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog", { name: /create branch/i })
    );

    expect(onBranchCreateSpy).toHaveBeenCalledWith(
      expect.stringMatching(branchName)
    );

    onBranchCreateSpy.mockRestore();
  });

  test("it allows a user to cancel a request to create a branch", async () => {
    render(<Active />);

    const branchName = faker.git.branch();

    setupBranchCreatorComponent(branchName, false, true);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog", { name: /create branch/i })
    );
  });

  test.todo(
    "it resets the form inputs to default values when the dialog is dismissed"
  );

  test("it prevents a user requesting the creation of a branch until they type a valid branch name", () => {
    render(<Active />);

    const branchName = faker.git.branch();

    const { branchNameInput, createButton } = setupBranchCreatorComponent(
      `${branchName}+`
    );

    expect(createButton).toBeDisabled();

    userEvent.clear(branchNameInput);

    expect(branchNameInput).not.toHaveValue();

    userEvent.type(branchNameInput, "{space}");

    expect(createButton).toBeDisabled();

    userEvent.clear(branchNameInput);

    expect(branchNameInput).not.toHaveValue();

    userEvent.type(branchNameInput, branchName);

    expect(createButton).not.toBeDisabled();
  });

  test("it handles errors correctly", async () => {
    render(<ActiveWithErrors />);

    const branchName = faker.git.branch();

    const {
      dialog,
      branchNameInput,
      cancelButton,
      createButton,
    } = setupBranchCreatorComponent(branchName, true);

    await waitFor(() => {
      expect(within(dialog).getByRole("alert")).toBeInTheDocument();
    });

    expect(branchNameInput).toHaveValue(branchName);

    expect(branchNameInput).not.toBeDisabled();

    expect(cancelButton).not.toBeDisabled();

    expect(createButton).not.toBeDisabled();

    expect(createButton).toHaveTextContent(/create/i);
  });
});

describe("KnowledgePageCreator", () => {
  const setupKnowledgePageCreatorComponent = (
    formData,
    submit = false,
    cancel = false
  ) => {
    const queryOpenDialogBtn = () => {
      return screen.getByRole("button", {
        name: /create knowledge page/i,
      });
    };

    const queryDialog = () => {
      return screen.queryByRole("dialog", {
        name: /create knowledge page/i,
      });
    };

    const queryTitleInput = () => {
      return within(queryDialog()).getByRole("textbox", { name: /title/i });
    };

    const queryReviewDateInput = () => {
      return within(queryDialog()).getByRole("textbox", {
        name: /review date/i,
      });
    };

    const queryUserFacingInput = () => {
      return within(queryDialog()).getByRole("checkbox", {
        name: /user facing/i,
      });
    };

    const queryCancelBtn = () => {
      return within(queryDialog()).getByRole("button", {
        name: /cancel/i,
      });
    };

    const queryCreateBtn = () => {
      return within(queryDialog()).queryByRole("button", {
        name: /create/i,
      });
    };

    const queryWorkingBtn = () => {
      return within(queryDialog()).queryByRole("button", {
        name: /working/i,
      });
    };

    const queryProgressIndicator = () => {
      return within(queryDialog()).queryByRole("progressbar");
    };

    const queryErrorMessage = () => {
      return within(queryDialog()).queryByRole("alert");
    };

    // Open dialog
    userEvent.click(queryOpenDialogBtn());

    // Enter title value
    if (formData?.title) {
      userEvent.type(queryTitleInput(), formData.title);
    }

    // Enter review date value
    if (formData?.reviewDate) {
      const reviewDateInput = queryReviewDateInput();

      userEvent.clear(reviewDateInput);
      userEvent.type(reviewDateInput, formData.reviewDate);
    }

    // Check user facing input
    if (formData?.userFacing) {
      userEvent.click(queryUserFacingInput());
    }

    if (!(submit && cancel)) {
      if (submit) {
        userEvent.click(queryCreateBtn());
      }

      if (cancel) {
        userEvent.click(queryCancelBtn());
      }
    }

    return {
      queryOpenDialogBtn,
      queryDialog,
      queryTitleInput,
      queryReviewDateInput,
      queryUserFacingInput,
      queryCancelBtn,
      queryCreateBtn,
      queryWorkingBtn,
      queryProgressIndicator,
      queryErrorMessage,
    };
  };

  test("a user can create a new knowledge page", async () => {
    const mockDateValue = "01/01/2021";

    const formData = {
      title: faker.lorem.words(3),
      reviewDate: "02/01/2021",
      userFacing: true,
    };

    const onKnowledgePageCreatorSpy = jest.spyOn(
      Active.args.knowledgePageCreatorArgs,
      "onSubmit"
    );

    MockDate.set(mockDateValue);

    render(<Active />);

    // Open knowledge creator dialog, complete form and click create
    const {
      queryOpenDialogBtn,
      queryDialog,
      queryTitleInput,
      queryReviewDateInput,
      queryUserFacingInput,
      queryCancelBtn,
      queryCreateBtn,
      queryWorkingBtn,
      queryProgressIndicator,
    } = setupKnowledgePageCreatorComponent(formData, true);

    // It sets the dialog UI to a loading state
    expect(queryProgressIndicator()).toBeInTheDocument();

    expect(queryTitleInput()).toBeDisabled();

    expect(queryReviewDateInput()).toBeDisabled();

    expect(queryUserFacingInput()).toBeDisabled();

    expect(queryCancelBtn()).toBeDisabled();

    expect(queryCreateBtn()).not.toBeInTheDocument();

    expect(queryWorkingBtn()).toBeInTheDocument();

    expect(queryWorkingBtn()).toBeDisabled();

    // it fires callback with form data
    expect(onKnowledgePageCreatorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: formData.title,
        reviewDate: new Date("01/02/2021").toISOString(),
        userFacing: true,
      })
    );

    // it removes dialog from DOM and resets form values to defaults
    await waitFor(() => {
      expect(queryDialog()).not.toBeInTheDocument();

      userEvent.click(queryOpenDialogBtn());

      expect(queryTitleInput()).not.toHaveValue();

      expect(queryReviewDateInput()).toHaveValue(
        dayjs(mockDateValue).add(6, "months").format("DD/MM/YYYY")
      );

      expect(queryUserFacingInput()).not.toBeChecked();
    });

    MockDate.reset();
    onKnowledgePageCreatorSpy.mockRestore();
  });

  test("a user can cancel the creation of a new knowledge page", async () => {
    const mockDateValue = "01/01/2021";

    const formData = {
      title: faker.lorem.words(3),
      reviewDate: "02/01/2021",
      userFacing: true,
    };

    MockDate.set(mockDateValue);

    render(<Active />);

    // Open knowledge creator dialog, complete form and click cancel
    const {
      queryOpenDialogBtn,
      queryDialog,
      queryTitleInput,
      queryReviewDateInput,
      queryUserFacingInput,
    } = setupKnowledgePageCreatorComponent(formData, false, true);

    // it removes dialog from DOM and resets form values to defaults
    await waitFor(() => {
      expect(queryDialog()).not.toBeInTheDocument();

      userEvent.click(queryOpenDialogBtn());

      expect(queryTitleInput()).not.toHaveValue();

      expect(queryReviewDateInput()).toHaveValue(
        dayjs(mockDateValue).add(6, "months").format("DD/MM/YYYY")
      );

      expect(queryUserFacingInput()).not.toBeChecked();
    });

    MockDate.reset();
  });

  test("a user can not request a new page when the form values are invalid", async () => {
    const mockDateValue = "01/01/2021";

    const formData = {
      title: `${faker.lorem.words(3)} +`,
      reviewDate: "31/12/2020",
      userFacing: true,
    };

    MockDate.set(mockDateValue);

    render(<Active />);

    // Open knowledge creator dialog, complete form with invalid data
    const {
      queryTitleInput,
      queryReviewDateInput,
      queryCreateBtn,
    } = setupKnowledgePageCreatorComponent(formData);

    expect(queryCreateBtn()).toBeDisabled();

    // it prevents requests when required fields have no values
    userEvent.clear(queryTitleInput());
    userEvent.clear(queryReviewDateInput());

    expect(queryCreateBtn()).toBeDisabled();

    // it enables the create button with valid required field values
    userEvent.type(queryTitleInput(), "test");
    userEvent.type(queryReviewDateInput(), "02/01/2021");

    expect(queryCreateBtn()).not.toBeDisabled();

    MockDate.reset();
  });

  test("it handles errors correctly", async () => {
    const mockDateValue = "01/01/2021";

    const formData = {
      title: faker.lorem.words(3),
      reviewDate: "02/01/2021",
      userFacing: true,
    };

    MockDate.set(mockDateValue);

    render(<ActiveWithErrors />);

    // Open knowledge creator dialog, complete form and click create
    const {
      queryTitleInput,
      queryReviewDateInput,
      queryUserFacingInput,
      queryCancelBtn,
      queryCreateBtn,
      queryWorkingBtn,
      queryProgressIndicator,
      queryErrorMessage,
    } = setupKnowledgePageCreatorComponent(formData, true);

    // It updates with an error message and persists user entered data, allowing user to cancel or re-try
    await waitFor(() => {
      expect(queryProgressIndicator()).not.toBeInTheDocument();

      expect(queryTitleInput()).toHaveValue(formData.title);

      expect(queryReviewDateInput()).toHaveValue(formData.reviewDate);

      expect(queryUserFacingInput()).toBeChecked();

      expect(queryCancelBtn()).not.toBeDisabled();

      expect(queryCreateBtn()).not.toBeDisabled();

      expect(queryWorkingBtn()).not.toBeInTheDocument();

      expect(queryErrorMessage()).toBeInTheDocument();
    });
  });
});
