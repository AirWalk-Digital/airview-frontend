import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComplianceTableRow } from "../components/compliance-table/compliance-table-row";

describe("ComplianceTableRow", () => {
  const baseProps = {
    environment: "Test environment",
    raisedDate: "Test raised date",
    timeSinceRaised: "Test time since raised",
    name: "Test name",
    tickets: [
      {
        reference: "Test ticket ref one",
        type: "incident",
      },
      {
        reference: "Test ticket ref two",
        type: "problem",
      },
    ],
    controlType: "security",
    severity: "high",
    children: <span>Children</span>,
  };

  describe("control type output", () => {
    beforeEach(() => {
      render(<ComplianceTableRow {...baseProps} />);
    });

    it("should set the tooltip value equal to the control type value", () => {
      expect(
        screen.getByTitle("Control type: security", { exact: false })
      ).toBeInTheDocument();
    });

    it("should set the accessibility label value equal to the controlType value", () => {
      expect(
        screen.getByText("Control type: security", { exact: false })
      ).toBeInTheDocument();
    });
  });

  describe("severity type output", () => {
    beforeEach(() => {
      render(<ComplianceTableRow {...baseProps} />);
    });

    it("should set the tooltip value equal to the severity value", () => {
      expect(
        screen.getByTitle("Severity: high", { exact: false })
      ).toBeInTheDocument();
    });

    it("should set the accessibility label value equal to the severity value", () => {
      expect(
        screen.getByText("Severity: high", { exact: false })
      ).toBeInTheDocument();
    });
  });

  describe("name output", () => {
    it("should output the name value equal to the value of the name passed via props", () => {
      render(<ComplianceTableRow {...baseProps} />);

      expect(screen.getByLabelText("name")).toHaveTextContent(/^Test name$/);
    });
  });

  describe("environment output", () => {
    it("should output the environment value equal to the value of the environment passed via props", () => {
      render(<ComplianceTableRow {...baseProps} />);

      expect(screen.getByLabelText("environment")).toHaveTextContent(
        /^Test environment$/
      );
    });
  });

  describe("ticket output", () => {
    beforeEach(() => {
      render(<ComplianceTableRow {...baseProps} />);
    });

    it("should output tickets equal to the length of the tickets passed via props", () => {
      const tickets = screen.queryAllByText("Test ticket", {
        exact: false,
      });

      expect(tickets.length).toBe(2);
    });

    it("should output tickets in the same order as the tickets passed via props", () => {
      const tickets = screen.queryAllByText("Test ticket", {
        exact: false,
      });

      expect(tickets[0]).toHaveTextContent(/^Test ticket ref one$/);
      expect(tickets[1]).toHaveTextContent(/^Test ticket ref two$/);
    });

    it("should output aria labels for each ticket type", () => {
      expect(
        screen.getByLabelText("Ticket type: incident")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Ticket type: problem")).toBeInTheDocument();
    });
  });

  describe("time since raised output", () => {
    it("should output the time since raised value equal to the value of the timeSinceRaised passed via props", () => {
      render(<ComplianceTableRow {...baseProps} />);

      expect(screen.getByLabelText("Time since raised")).toHaveTextContent(
        /^Test time since raised$/
      );
    });
  });

  describe("raised date output", () => {
    it("should output the raised date value equal to the value of the raisedDate passed via props", () => {
      render(<ComplianceTableRow {...baseProps} />);

      expect(screen.getByLabelText("Raised date")).toHaveTextContent(
        /^\(Test raised date\)$/
      );
    });
  });

  describe("with rowCollapsed", () => {
    beforeEach(() => {
      render(<ComplianceTableRow {...baseProps} />);
    });

    it("should not display the expanded row content", () => {
      expect(screen.getByText("Children")).not.toBeVisible();
    });

    it("should indicate to the user that the row can be expanded", () => {
      expect(screen.getByLabelText("Expand row")).toBeInTheDocument();

      expect(screen.queryByLabelText("Collapse row")).not.toBeInTheDocument();
    });

    it("should expand the additional content on click of the expand button", () => {
      expect(screen.getByText("Children")).not.toBeVisible();

      userEvent.click(screen.getByLabelText("Expand row"));

      waitFor(() => {
        expect(screen.getByText("Children")).toBeVisible();
      });
    });
  });

  describe("on click of the toggle row expanded button", () => {
    it("should display the expanded row content", () => {
      render(<ComplianceTableRow {...baseProps} />);

      userEvent.click(screen.getByLabelText("Expand row"));

      expect(screen.getByText("Children")).toBeVisible();
    });
  });
});
