import React from "react";
import { render, screen } from "@testing-library/react";
import { ComplianceTableNoIssuesMessage } from "../components/compliance-table/compliance-table-no-issues-message";

describe("ComplianceTableNoIssuesFeedback", () => {
  it("should render a feedback message to the user", () => {
    render(<ComplianceTableNoIssuesMessage />);

    expect(
      screen.getByLabelText("Compliance Table no issues feedback")
    ).toBeInTheDocument();
  });

  it("should not render the compliance table", () => {
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
