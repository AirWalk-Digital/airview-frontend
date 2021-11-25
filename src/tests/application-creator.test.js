import React from "react";
import {
  within,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  PreviewModeController,
  ApplicationCreator,
} from "../components/preview-mode-controller";

const defaultProps = {
  applications: [
    {
      name: "Application One",
      id: 1,
    },
    {
      name: "Application Two",
      id: 2,
    },
  ],
  applicationTypes: [
    {
      name: "Type One",
      id: 1,
    },
    {
      name: "Type Two",
      id: 2,
    },
  ],
  environments: [
    {
      name: "Environment One",
      id: 1,
    },
    {
      name: "Environment Two",
      id: 2,
    },
  ],
  referenceTypes: ["type_one", "type_two"],
  onSubmit: jest.fn().mockResolvedValue(),
};

const expectedSubmittedFormData = {
  applicationTypeId: 1,
  name: "Test Application",
  environmentId: 1,
  references: [
    {
      type: "type_one",
      reference: "Test Reference",
    },
  ],
  parentId: 1,
};

function setupComponent(overrides) {
  render(
    <PreviewModeController
      enabled
      workingRepo="test-repo"
      workingBranch="main"
      onToggle={() => {}}
      branches={[
        {
          name: "main",
          protected: true,
        },
      ]}
    >
      <ApplicationCreator {...defaultProps} {...overrides} />
    </PreviewModeController>
  );
}

function checkForEmptyFormValues() {
  const parentApplicationInput = screen.getByRole("button", {
    name: /parent application /i,
  });

  const applicationNameInput = screen.getByRole("textbox", {
    name: /application name/i,
  });

  const applicationTypeInput = screen.getByRole("button", {
    name: /application type /i,
  });

  const environmentInput = screen.getByRole("button", {
    name: /environment /i,
  });

  const referenceTypeInputs = screen
    .getByRole("group", { name: /references/i })
    .querySelectorAll("input");

  expect(parentApplicationInput.nextElementSibling).not.toHaveValue();
  expect(applicationNameInput).not.toHaveValue();
  expect(applicationTypeInput.nextElementSibling).not.toHaveValue();
  expect(environmentInput.nextElementSibling).not.toHaveValue();
  expect(referenceTypeInputs.length).toEqual(0);
}

async function enterFormData(afterFieldEntry) {
  // Complete parent application field
  const parentApplicationInput = screen.getByRole("button", {
    name: /parent application /i,
  });

  userEvent.click(parentApplicationInput);

  userEvent.click(
    screen.getByRole("option", { name: defaultProps.applications[0].name })
  );

  if (afterFieldEntry) afterFieldEntry();

  // Complete application name field
  const applicationNameInput = screen.getByRole("textbox", {
    name: /application name/i,
  });

  userEvent.type(applicationNameInput, "Test Application");

  if (afterFieldEntry) afterFieldEntry();

  // Complete application type input
  const applicationTypeInput = screen.getByRole("button", {
    name: /application type /i,
  });

  userEvent.click(applicationTypeInput);

  userEvent.click(
    screen.getByRole("option", { name: defaultProps.applicationTypes[0].name })
  );

  if (afterFieldEntry) afterFieldEntry();

  // Complete environment input
  const environmentInput = screen.getByRole("button", {
    name: /environment /i,
  });

  userEvent.click(environmentInput);

  userEvent.click(
    screen.getByRole("option", { name: defaultProps.environments[0].name })
  );

  if (afterFieldEntry) afterFieldEntry();

  // Add reference group
  userEvent.click(screen.getByRole("button", { name: /add reference/i }));

  const references = screen.getByRole("group", { name: /references/i });

  // Complete reference type input
  const referenceTypeInput = within(references).getByRole("button", {
    name: /type/i,
  });

  userEvent.click(referenceTypeInput);

  userEvent.click(
    screen.getByRole("option", { name: defaultProps.referenceTypes[0] })
  );

  if (afterFieldEntry) afterFieldEntry();

  // Complete reference input
  const referenceInput = within(references).getByRole("textbox", {
    name: /reference/i,
  });

  userEvent.type(referenceInput, "Test Reference");
}

async function revealApplicationCreatorModal() {
  expect(
    screen.queryByRole("dialog", {
      name: /create new application/i,
    })
  ).not.toBeInTheDocument();

  userEvent.click(
    screen.queryByRole("button", {
      name: /create new application/i,
    })
  );

  expect(
    await screen.findByRole("dialog", {
      name: /create new application/i,
    })
  ).toBeInTheDocument();
}

async function dismissApplicationCreatorModal() {
  userEvent.click(screen.getByRole("button", { name: /cancel/i }));

  await waitForElementToBeRemoved(
    screen.getByRole("dialog", {
      name: /create new application/i,
    })
  );

  expect(
    screen.queryByRole("dialog", {
      name: /create new application/i,
    })
  ).not.toBeInTheDocument();
}

function submitForm() {
  userEvent.click(screen.getByRole("button", { name: /create/i }));
}

beforeEach(() => {
  defaultProps.onSubmit.mockClear();
});

test("a user can create a new application", async () => {
  setupComponent();
  await revealApplicationCreatorModal();
  checkForEmptyFormValues();
  await enterFormData();
  submitForm();

  await expect(defaultProps.onSubmit).toBeCalledWith(
    expect.objectContaining(expectedSubmittedFormData)
  );

  await waitForElementToBeRemoved(
    screen.getByRole("dialog", {
      name: /create new application/i,
    })
  );

  expect(
    screen.queryByRole("dialog", {
      name: /create new application/i,
    })
  ).not.toBeInTheDocument();
});

test("the component correctly responds to submission errors", async () => {
  const errorMessage = "Form error";
  const onSubmitHandler = jest
    .fn()
    .mockRejectedValueOnce({ error: errorMessage })
    .mockResolvedValue();

  setupComponent({ onSubmit: onSubmitHandler });
  await revealApplicationCreatorModal();
  checkForEmptyFormValues();
  await enterFormData();
  submitForm();

  expect(await screen.findByText(errorMessage)).toBeInTheDocument();

  expect(
    screen.getByRole("dialog", {
      name: /create new application/i,
    })
  ).toBeInTheDocument();

  submitForm();

  await expect(onSubmitHandler).toHaveBeenLastCalledWith(
    expect.objectContaining(expectedSubmittedFormData)
  );
});

test("the component form is reset when the UI dismissed", async () => {
  setupComponent();

  await revealApplicationCreatorModal();

  await enterFormData();

  await dismissApplicationCreatorModal();

  await revealApplicationCreatorModal();

  checkForEmptyFormValues();
});

test("a user can not submit form data until all required fields are set", async () => {
  setupComponent();
  await revealApplicationCreatorModal();
  checkForEmptyFormValues();
  await enterFormData(
    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled()
  );
});

test("a user can remove added references", async () => {
  setupComponent();
  await revealApplicationCreatorModal();
  checkForEmptyFormValues();
  await enterFormData();

  const deleteBtn = screen.getByLabelText(/delete/i);

  userEvent.click(deleteBtn);

  const references = screen.getByRole("group", { name: /references/i });

  const referenceTypeInput = within(references).queryByRole("button", {
    name: /type/i,
  });

  const referenceInput = within(references).queryByRole("textbox", {
    name: /reference/i,
  });

  expect(referenceTypeInput).not.toBeInTheDocument();
  expect(referenceInput).not.toBeInTheDocument();
});
