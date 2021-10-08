import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComplianceTableRowDetail } from "../components/compliance-table/compliance-table-row-detail";

function makeDetailData(overrides) {
  return {
    instances: [
      {
        id: 1,
        name: "Server Instance 1",
        status: "pending",
      },
      {
        id: 2,
        name: "Server Instance 2",
        status: "none",
      },
      {
        id: 3,
        name: "Server Instance 3",
        status: "none",
      },
    ],
    control: {
      name: "Control name",
      url: "",
    },
    frameworks: [
      {
        name: "Control framework 1",
        url: "",
      },
      {
        name: "Control framework 2",
        url: "",
      },
      {
        name: "Control framework 3",
        url: "",
      },
    ],
    environment: "Environment label",
    assignmentGroup: "Assignment Group Label",
    assignee: "Assignee label",
    ...overrides,
  };
}

describe("ComplianceTableRowDetail", () => {
  describe("with a mixture of pending and non-pending instances", () => {
    const handleOnAcceptOfRisk = jest.fn();

    beforeEach(() => {
      render(
        <ComplianceTableRowDetail
          detailData={makeDetailData()}
          onAcceptOfRisk={handleOnAcceptOfRisk}
          applicationId={1}
        />
      );
    });

    afterEach(() => {
      handleOnAcceptOfRisk.mockClear();
    });

    it("should enable the accept risk button", () => {
      const acceptRiskButton = screen.getByRole("button", {
        name: /accept risk/i,
      });

      expect(acceptRiskButton).not.toBeDisabled();
    });

    it("should launch the accept risk dialog on click of the risk button", () => {
      const acceptRiskButton = screen.getByRole("button", {
        name: /accept risk/i,
      });

      expect(screen.queryByText(/accept risks/i)).toBeFalsy();

      userEvent.click(acceptRiskButton);

      expect(screen.getByText(/accept risks/i)).toBeVisible();
    });

    it("should indicate to the user pending instances", () => {
      expect(
        screen.getByText(/Server Instance 1 \(pending\)/i)
      ).toBeInTheDocument();

      expect(screen.getByText(/Server Instance 2/i)).toBeInTheDocument();

      expect(screen.getByText(/Server Instance 3/i)).toBeInTheDocument();
    });
  });

  describe("with all pending instances", () => {
    const handleOnAcceptOfRisk = jest.fn();

    beforeEach(() => {
      render(
        <ComplianceTableRowDetail
          detailData={makeDetailData({
            instances: [
              {
                id: 1,
                name: "Server Instance 1",
                status: "pending",
              },
            ],
          })}
          onAcceptOfRisk={handleOnAcceptOfRisk}
          applicationId={1}
        />
      );
    });

    afterEach(() => {
      handleOnAcceptOfRisk.mockClear();
    });

    it("should indicate to the user the pending instances", () => {
      expect(
        screen.getByText(/Server Instance 1 \(pending\)/i)
      ).toBeInTheDocument();
    });

    it("should disable the accept risk button", () => {
      const acceptRiskButton = screen.getByRole("button", {
        name: /accept risk/i,
      });

      expect(acceptRiskButton).toBeDisabled();
    });

    it("should not launch the accept risk dialog on click of the risk button", () => {
      const acceptRiskButton = screen.getByRole("button", {
        name: /accept risk/i,
      });

      userEvent.click(acceptRiskButton);

      expect(screen.queryByText(/accept risks/i)).toBeFalsy();
      expect(handleOnAcceptOfRisk).not.toHaveBeenCalled();
    });
  });

  it.todo("write tests for other data once feature is fully defined");
});
