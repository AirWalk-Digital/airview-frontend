import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import MockDate from "mockdate";
import { getRisk } from "../lib/get-risk";
import { ComplianceTableAcceptRiskDialog } from "../components/compliance-table/compliance-table-accept-risk-dialog";

function buildPropsData(overrides) {
  return {
    open: true,
    onClose: jest.fn(),
    onAccept: jest.fn(),
    exemptions: [
      {
        id: 1,
        name: "Exemption One",
        status: "none",
      },
      {
        id: 2,
        name: "Exemption Two",
        status: "none",
      },
      {
        id: 3,
        name: "Exemption Three",
        status: "pending",
      },
    ],
    applicationId: 1,
    impactLevel: getRisk,
    ...overrides,
  };
}

function buildFormValues(overrides) {
  return {
    summary: faker.lorem.sentence(5),
    mitigation: faker.lorem.sentence(5),
    probability: "Moderate",
    impact: "Medium",
    resources: ["Exemption One", "Exemption Two"],
    exemptionEnd: "02/12/2021",
    notes: faker.lorem.paragraph(1),
    ...overrides,
  };
}

beforeAll(() => {
  MockDate.set("2021-12-01T00:01Z");
});

afterAll(() => {
  MockDate.reset();
});

describe("ComplianceTableAcceptRiskDialog", () => {
  describe("on initial reveal of the dialog", () => {
    const props = buildPropsData();

    beforeEach(() => {
      render(<ComplianceTableAcceptRiskDialog {...props} />);
    });

    afterEach(() => {
      props.onClose.mockClear();
      props.onAccept.mockClear();
    });

    it("should disable the submit button", () => {
      const submitButton = screen.getByRole("button", { name: /submit/i });

      expect(submitButton).toBeDisabled();
    });

    it("should set the summary text input to a null value", () => {
      const summaryInput = screen.getByRole("textbox", { name: /summary/i });

      expect(summaryInput).not.toHaveValue();
      expect(summaryInput).not.toHaveDisplayValue();
    });

    it("should set the mitigation text input to a null value", () => {
      const mitigationInput = screen.getByRole("textbox", {
        name: /mitigation/i,
      });

      expect(mitigationInput).not.toHaveValue();
      expect(mitigationInput).not.toHaveDisplayValue();
    });

    it("should select the correct default probability value", () => {
      const probabilities = screen.getByRole("group", { name: /probability/i });

      const selectedProbability = Array.from(
        probabilities.querySelectorAll("button[aria-selected='true']")
      );

      const nonSelectedProbabilities = Array.from(
        probabilities.querySelectorAll("button[aria-selected='false']")
      );

      expect(selectedProbability.length).toBe(1);
      expect(selectedProbability[0]).toHaveTextContent(/^low$/i);

      nonSelectedProbabilities.forEach((probability) => {
        expect(probability).toHaveAttribute("aria-selected", "false");
      });
    });

    it("should output all available probability values for selection", () => {
      const probabilities = Array.from(
        screen
          .getByRole("group", { name: /probability/i })
          .querySelectorAll("button")
      );

      expect(probabilities.length).toBe(4);
      expect(probabilities[0]).toHaveTextContent(/^low$/i);
      expect(probabilities[1]).toHaveTextContent(/^moderate$/i);
      expect(probabilities[2]).toHaveTextContent(/^high$/i);
      expect(probabilities[3]).toHaveTextContent(/^absolute$/i);
    });

    it("should select the correct default impact value", () => {
      const impacts = screen.getByRole("group", { name: /impact/i });

      const selectedImpact = Array.from(
        impacts.querySelectorAll("button[aria-selected='true']")
      );

      const nonSelectedImpacts = Array.from(
        impacts.querySelectorAll("button[aria-selected='false']")
      );

      expect(selectedImpact.length).toBe(1);
      expect(selectedImpact[0]).toHaveTextContent(/^low$/i);

      nonSelectedImpacts.forEach((impact) => {
        expect(impact).toHaveAttribute("aria-selected", "false");
      });
    });

    it("should output all available impact values for selection", () => {
      const probabilities = Array.from(
        screen
          .getByRole("group", { name: /impact/i })
          .querySelectorAll("button")
      );

      expect(probabilities.length).toBe(3);
      expect(probabilities[0]).toHaveTextContent(/^low$/i);
      expect(probabilities[1]).toHaveTextContent(/^medium$/i);
      expect(probabilities[2]).toHaveTextContent(/^high$/i);
    });

    it("should display all passed exemptions as options for the resources multiselect", () => {
      expect(screen.getByText(/exemption one/i)).toBeInTheDocument();
      expect(screen.getByText(/exemption two/i)).toBeInTheDocument();
      expect(screen.getByText(/exemption three/i)).toBeInTheDocument();
    });

    it("should indicate any pending non-selectable options for the resources multiselect", () => {
      const pendingResource = screen.getByText(/exemption three \(pending\)/i);

      expect(pendingResource).toBeInTheDocument();
      expect(pendingResource).toHaveAttribute("aria-disabled", "true");
    });

    it("should indicate any selectable options for the resources multiselect", () => {
      expect(screen.getByText(/exemption one/i)).toHaveAttribute(
        "aria-disabled",
        "false"
      );

      expect(screen.getByText(/exemption two/i)).toHaveAttribute(
        "aria-disabled",
        "false"
      );
    });

    it("should not have a selected resources value", () => {
      const selectedResourcesLabel = document.querySelector(
        `#resources-${props.applicationId}`
      );

      const selectedResourcesInput = selectedResourcesLabel.nextSibling;

      expect(selectedResourcesLabel.textContent).toBe("​");

      expect(selectedResourcesInput).not.toHaveValue();
    });

    it("should set the limited exemption value to false", () => {
      const limitedExemptionValue = screen.getByRole("checkbox", {
        name: /limited exemption\?/i,
      });

      expect(limitedExemptionValue).not.toBeChecked();
    });

    it("should not reveal the exemption end input to the user", async () => {
      const exemptionEndInput = screen.queryByRole("textbox", {
        name: /exemption end/i,
      });

      expect(exemptionEndInput).toBeFalsy();
    });

    it("should set the initial exemption end date to the current date", () => {
      const limitedExemptionInput = screen.getByRole("checkbox", {
        name: /limited exemption\?/i,
      });

      userEvent.click(limitedExemptionInput);

      const exemptionEndInput = screen.getByRole("textbox", {
        name: /exemption end/i,
      });

      expect(exemptionEndInput).toHaveValue("01/12/2021");
    });

    it("should set the notes textfield input to a null value", () => {
      const notesInput = screen.getByRole("textbox", { name: /notes/i });

      expect(notesInput).not.toHaveValue();
      expect(notesInput).not.toHaveDisplayValue();
    });
  });

  describe("interacting with the form", () => {
    const props = buildPropsData();
    const formValues = buildFormValues();

    beforeEach(() => {
      render(<ComplianceTableAcceptRiskDialog {...props} />);
    });

    afterEach(() => {
      props.onClose.mockClear();
      props.onAccept.mockClear();
    });

    it("should prevent a user typing an empty string as a value to any text input field", () => {
      const emptyStringInput = "{space}{space}{space}";
      const summaryInput = screen.getByRole("textbox", { name: /summary/i });
      const mitigationInput = screen.getByRole("textbox", {
        name: /mitigation/i,
      });
      const notesInput = screen.getByRole("textbox", {
        name: /notes/i,
      });

      userEvent.type(summaryInput, emptyStringInput);
      userEvent.type(mitigationInput, emptyStringInput);
      userEvent.type(notesInput, emptyStringInput);

      expect(summaryInput).toHaveDisplayValue("");
      expect(summaryInput).toHaveValue("");
      expect(mitigationInput).toHaveDisplayValue("");
      expect(mitigationInput).toHaveValue("");
      expect(notesInput).toHaveDisplayValue("");
      expect(notesInput).toHaveValue("");
    });

    it("should set the value of the summary text input equal to a valid value typed by a user", () => {
      const summaryInput = screen.getByRole("textbox", { name: /summary/i });

      userEvent.type(summaryInput, formValues.summary);

      expect(summaryInput).toHaveDisplayValue(formValues.summary);
      expect(summaryInput).toHaveValue(formValues.summary);
    });

    it("should set the value of the mitigation text input equal to a valid value typed by a user", () => {
      const mitigationInput = screen.getByRole("textbox", {
        name: /mitigation/i,
      });

      userEvent.type(mitigationInput, formValues.mitigation);

      expect(mitigationInput).toHaveDisplayValue(formValues.mitigation);
      expect(mitigationInput).toHaveValue(formValues.mitigation);
    });

    it("should set the value of the probability input equal to the value selected by a user", () => {
      const probabilitySelection = screen.getByRole("button", {
        name: formValues.probability,
      });

      userEvent.click(probabilitySelection);

      const probabilityNonSelected = Array.from(
        screen
          .getByRole("group", { name: /probability/i })
          .querySelectorAll("button:not([aria-selected='true'])")
      );

      expect(probabilitySelection).toHaveAttribute("aria-selected", "true");

      expect(probabilityNonSelected).toHaveLength(3);

      probabilityNonSelected.forEach((option) => {
        expect(option).toHaveAttribute("aria-selected", "false");
      });
    });

    it("should set the value of the impact input equal to the value selected by a user", () => {
      const impactSelection = screen.getByRole("button", {
        name: formValues.impact,
      });

      userEvent.click(impactSelection);

      const impactNonSelected = Array.from(
        screen
          .getByRole("group", { name: /impact/i })
          .querySelectorAll("button[aria-selected='false']")
      );

      expect(impactSelection).toHaveAttribute("aria-selected", "true");

      expect(impactNonSelected).toHaveLength(2);

      impactNonSelected.forEach((option) => {
        expect(option).toHaveAttribute("aria-selected", "false");
      });
    });

    it("should update the impact level on change of a probability value", () => {
      const impactLevel = screen.getByLabelText(/^impact level$/i);

      expect(impactLevel).toHaveTextContent(/^low$/i);

      const probabilitySelection = Array.from(
        screen
          .getByRole("group", { name: /probability/i })
          .querySelectorAll("button")
      )[2];

      userEvent.click(probabilitySelection);

      expect(impactLevel).toHaveTextContent(/^medium$/i);
    });

    it("should output the correct impact level on change of an impact value", () => {
      const impactLevel = screen.getByLabelText(/^impact level$/i);

      expect(impactLevel).toHaveTextContent(/^low$/i);

      const impactSelection = Array.from(
        screen
          .getByRole("group", { name: /impact/i })
          .querySelectorAll("button")
      )[2];

      userEvent.click(impactSelection);

      expect(impactLevel).toHaveTextContent(/^medium$/i);
    });

    it("should set the value of the resorces input equal to the values selected by a user", () => {
      formValues.resources.forEach((resource) => {
        userEvent.click(screen.getByText(resource));
      });

      const selectedResourcesLabel = document.querySelector(
        `#resources-${props.applicationId}`
      );

      const selectedResourcesInput = selectedResourcesLabel.nextSibling;

      expect(selectedResourcesLabel.innerHTML).toBe(
        "Exemption One, Exemption Two"
      );

      expect(selectedResourcesInput.value).toBe("Exemption One,Exemption Two");
    });

    it("should reveal the exemption end input when a user sets the limited exemption input to a truthy value", () => {
      const limitedExemptionInput = screen.getByRole("checkbox", {
        name: /limited exemption/i,
      });

      userEvent.click(limitedExemptionInput);

      const exemptionEndInput = screen.getByRole("textbox", {
        name: /exemption end/i,
      });

      expect(exemptionEndInput).toBeInTheDocument();
    });

    it("should hide the exemption end input when a user sets the limited exemption input to a falsy value", () => {
      const limitedExemptionInput = screen.getByRole("checkbox", {
        name: /limited exemption/i,
      });

      userEvent.click(limitedExemptionInput);

      expect(
        screen.getByRole("textbox", {
          name: /exemption end/i,
        })
      ).toBeInTheDocument();

      userEvent.click(limitedExemptionInput);

      expect(
        screen.queryByRole("textbox", {
          name: /exemption end/i,
        })
      ).toBeFalsy();
    });

    it("should indicate an error if a user enters a past date value for the exemption end input", () => {
      const limitedExemptionInput = screen.getByRole("checkbox", {
        name: /limited exemption/i,
      });

      userEvent.click(limitedExemptionInput);

      const exemptionEndInput = screen.getByRole("textbox", {
        name: /exemption end/i,
      });

      userEvent.type(exemptionEndInput, "{selectall}{del}01/12/2020");

      expect(
        screen.getByText(/date should not be a past date/i)
      ).toBeInTheDocument();
    });

    it("should indicate an error if a user enteres an invalid date value for the exemption end input", () => {
      const limitedExemptionInput = screen.getByRole("checkbox", {
        name: /limited exemption/i,
      });

      userEvent.click(limitedExemptionInput);

      const exemptionEndInput = screen.getByRole("textbox", {
        name: /exemption end/i,
      });

      userEvent.type(exemptionEndInput, "{selectall}{del}9");

      expect(screen.getByText(/invalid date/i)).toBeInTheDocument();
    });

    it("should set the exemption end input equal to the value typed by a user", () => {
      const limitedExemptionInput = screen.getByRole("checkbox", {
        name: /limited exemption/i,
      });

      userEvent.click(limitedExemptionInput);

      const exemptionEndInput = screen.getByRole("textbox", {
        name: /exemption end/i,
      });

      userEvent.type(
        exemptionEndInput,
        `{selectall}{del}${formValues.exemptionEnd}`
      );

      expect(exemptionEndInput).toHaveValue(formValues.exemptionEnd);
    });

    it("should set the value of the notes input equal to the value typed by a user", () => {
      const notesInput = screen.getByRole("textbox", { name: /notes/i });

      userEvent.type(notesInput, formValues.notes);

      expect(notesInput).toHaveValue(formValues.notes);
      expect(notesInput).toHaveDisplayValue(formValues.notes);
    });

    it("should enable the submit button once all required fields are set with valid values", () => {
      const submitButton = screen.getByRole("button", { name: /submit/i });

      const summaryInput = screen.getByRole("textbox", { name: /summary/i });
      const mitigationInput = screen.getByRole("textbox", {
        name: /mitigation/i,
      });
      const limitedExemptionInput = screen.getByRole("checkbox", {
        name: /limited exemption\?/i,
      });

      expect(submitButton).toBeDisabled();

      userEvent.type(summaryInput, formValues.summary);
      userEvent.type(mitigationInput, formValues.mitigation);

      formValues.resources.forEach((resource) => {
        userEvent.click(screen.getByText(resource));
      });

      expect(submitButton).not.toBeDisabled();

      userEvent.click(limitedExemptionInput);

      const exemptionEndInput = screen.getByRole("textbox", {
        name: /exemption end/i,
      });

      userEvent.type(exemptionEndInput, `{selectall}{del}`);

      expect(submitButton).toBeDisabled();

      userEvent.type(exemptionEndInput, formValues.exemptionEnd);

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("submitting the form", () => {
    const props = buildPropsData();
    const formValues = buildFormValues();

    beforeEach(() => {
      render(<ComplianceTableAcceptRiskDialog {...props} />);

      userEvent.type(
        screen.getByRole("textbox", { name: /summary/i }),
        formValues.summary
      );
      userEvent.type(
        screen.getByRole("textbox", {
          name: /mitigation/i,
        }),
        formValues.mitigation
      );
      formValues.resources.forEach((resource) => {
        userEvent.click(screen.getByText(resource));
      });
      userEvent.click(
        screen.getByRole("checkbox", {
          name: /limited exemption\?/i,
        })
      );
      userEvent.type(
        screen.getByRole("textbox", { name: /notes/i }),
        formValues.notes
      );
    });

    afterEach(() => {
      props.onClose.mockClear();
      props.onAccept.mockClear();
    });

    it("should indicate to the user that the form is submitting", () => {
      const submitButton = screen.getByRole("button", { name: /submit/i });

      userEvent.click(submitButton);

      expect(submitButton).toHaveTextContent(/submitting/i);
    });

    it("should disable the entire form whilst submitting data", () => {
      const summaryInput = screen.getByRole("textbox", { name: /summary/i });
      const mitigationInput = screen.getByRole("textbox", {
        name: /mitigation/i,
      });
      const probabilityInputs = Array.from(
        screen
          .getByRole("group", { name: /probability/i })
          .querySelectorAll("button")
      );
      const impactInputs = Array.from(
        screen
          .getByRole("group", { name: /impact/i })
          .querySelectorAll("button")
      );
      const limitedExemptionInput = screen.getByRole("checkbox", {
        name: /limited exemption/i,
      });
      const exemptionEndInput = screen.getByRole("textbox", {
        name: /exemption end/i,
      });
      const notesInput = screen.getByRole("textbox", { name: /notes/i });
      const submitButton = screen.getByRole("button", { name: /submit/i });
      const cancelButton = screen.getByRole("button", { name: /cancel/i });

      userEvent.click(submitButton);

      expect(summaryInput).toBeDisabled();
      expect(mitigationInput).toBeDisabled();
      probabilityInputs.forEach((input) => expect(input).toBeDisabled());
      impactInputs.forEach((input) => expect(input).toBeDisabled());
      expect(limitedExemptionInput).toBeDisabled();
      expect(exemptionEndInput).toBeDisabled();
      expect(notesInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it("should submit the correct form data for processing", () => {
      const submitButton = screen.getByRole("button", { name: /submit/i });
      userEvent.click(submitButton);

      const formData = { ...props.onAccept.mock.calls[0][0] };

      expect(formData.summary.value).toBe(formValues.summary);
      expect(formData.mitigation.value).toBe(formValues.mitigation);
      expect(formData.probability.value).toBe("Low");
      expect(formData.impact.value).toBe("Low");
      expect(formData.resources.value).toEqual([
        "Exemption One",
        "Exemption Two",
      ]);
      expect(formData.limitedExemption.value).toBe(true);
      expect(formData.exemptionEnd.value).toBeInstanceOf(Date);
      expect(formData.exemptionEnd.value.getDate()).toBe(1);
      expect(formData.exemptionEnd.value.getMonth()).toBe(11);
      expect(formData.exemptionEnd.value.getFullYear()).toBe(2021);
      expect(formData.notes.value).toBe(formValues.notes);
      expect(formData.applicationId.value).toBe(props.applicationId);
    });

    it("should request to close the dialog once the form has successfully submitted", async () => {
      props.onAccept.mockImplementation(() => Promise.resolve());

      const submitButton = screen.getByRole("button", { name: /submit/i });
      userEvent.click(submitButton);

      expect(await props.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("closing the dialog", () => {
    const props = buildPropsData();

    beforeEach(() => {
      render(<ComplianceTableAcceptRiskDialog {...props} />);
    });

    afterEach(() => {
      props.onClose.mockClear();
      props.onAccept.mockClear();
    });

    it("should request to close the dialog on click of the cancel button", () => {
      const cancelButton = screen.getByRole("button", { name: /cancel/i });

      userEvent.click(cancelButton);

      expect(props.onClose).toHaveBeenCalledTimes(1);
    });
  });
});
