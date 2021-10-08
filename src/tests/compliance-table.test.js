import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockDate from "mockdate";
import { ComplianceTable } from "../components/compliance-table";

const baseApplicationData = {
  id: 1,
  controlType: "security",
  severity: "high",
  name: "Application 1",
  tickets: [
    {
      reference: "Reference",
      type: "incident",
    },
  ],
  environment: "production",
  raisedDateTime: "2021-12-31T23:58Z",
  applicationDetailData: {
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
      name: "AWS ECS Pattern  CPU Monitoring",
      url: "",
    },
    frameworks: [
      {
        name: "PCI-DSS",
        url: "",
      },
      {
        name: "ISO27K",
        url: "",
      },
      {
        name: "GPK",
        url: "",
      },
    ],
    environment: "production",
    assignmentGroup: "Server Team",
    assignee: "James Brown",
  },
};

beforeAll(() => {
  MockDate.set("2021-12-31T23:59Z");
});

afterAll(() => {
  MockDate.reset();
});

describe("ComplianceTable - sorting issues", () => {
  beforeEach(() => {
    render(
      <ComplianceTable
        applications={[
          {
            ...baseApplicationData,
          },
          {
            ...baseApplicationData,
            id: 2,
            name: "Application 2",
            raisedDateTime: "2021-12-31T23:48Z",
          },
          {
            ...baseApplicationData,
            id: 3,
            name: "Application 3",
            raisedDateTime: "2021-12-31T22:58Z",
            environment: "development",
          },
        ]}
      />
    );
  });

  describe("default sorting", () => {
    it("should sort issues by age desc", () => {
      const issues = screen.queryAllByLabelText("name");

      expect(issues[0]).toHaveTextContent("Application 3");
      expect(issues[1]).toHaveTextContent("Application 2");
      expect(issues[2]).toHaveTextContent("Application 1");
    });

    it("should set the sorting UI to age desc", () => {
      expect(screen.getByLabelText("Sorting order")).toHaveTextContent(
        "Age sorted descending"
      );
    });
  });

  describe("changing sorting from age desc to age asc", () => {
    it("should sort issues by age asc", async () => {
      const intialIssues = screen.queryAllByLabelText("name");

      expect(intialIssues[0]).toHaveTextContent("Application 3");
      expect(intialIssues[1]).toHaveTextContent("Application 2");
      expect(intialIssues[2]).toHaveTextContent("Application 1");

      userEvent.click(screen.getByLabelText("Sort by age"));

      const sortedIssues = screen.queryAllByLabelText("name");

      expect(sortedIssues[0]).toHaveTextContent("Application 1");
      expect(sortedIssues[1]).toHaveTextContent("Application 2");
      expect(sortedIssues[2]).toHaveTextContent("Application 3");
    });

    it("should set the sorting UI to age asc", async () => {
      expect(screen.getByLabelText("Sorting order")).toHaveTextContent(
        "Age sorted descending"
      );

      userEvent.click(screen.getByLabelText("Sort by age"));

      expect(screen.getByLabelText("Sorting order")).toHaveTextContent(
        "Age sorted ascending"
      );
    });
  });

  describe("changing sorting from age asc to age desc", () => {
    it("should sort issues by age desc", async () => {
      const initialIssues = screen.queryAllByLabelText("name");

      expect(initialIssues[0]).toHaveTextContent("Application 3");
      expect(initialIssues[1]).toHaveTextContent("Application 2");
      expect(initialIssues[2]).toHaveTextContent("Application 1");

      userEvent.click(screen.getByLabelText("Sort by age"));

      const firstSortedIssues = screen.queryAllByLabelText("name");

      expect(firstSortedIssues[0]).toHaveTextContent("Application 1");
      expect(firstSortedIssues[1]).toHaveTextContent("Application 2");
      expect(firstSortedIssues[2]).toHaveTextContent("Application 3");

      userEvent.click(screen.getByLabelText("Sort by age"));

      const secondSortedIssues = screen.queryAllByLabelText("name");

      expect(secondSortedIssues[0]).toHaveTextContent("Application 3");
      expect(secondSortedIssues[1]).toHaveTextContent("Application 2");
      expect(secondSortedIssues[2]).toHaveTextContent("Application 1");
    });

    it("should set the sorting UI to age asc", async () => {
      expect(screen.getByLabelText("Sorting order")).toHaveTextContent(
        "Age sorted descending"
      );

      userEvent.click(screen.getByLabelText("Sort by age"));

      expect(screen.getByLabelText("Sorting order")).toHaveTextContent(
        "Age sorted ascending"
      );

      userEvent.click(screen.getByLabelText("Sort by age"));

      expect(screen.getByLabelText("Sorting order")).toHaveTextContent(
        "Age sorted descending"
      );
    });
  });
});

describe("ComplianceTable - filtering issues", () => {
  beforeEach(() => {
    render(
      <ComplianceTable
        applications={[
          {
            ...baseApplicationData,
          },
          {
            ...baseApplicationData,
            id: 2,
            name: "Application 2",
            raisedDateTime: "2021-12-31T23:48Z",
            environment: "staging",
          },
          {
            ...baseApplicationData,
            id: 3,
            name: "Application 3",
            raisedDateTime: "2021-12-31T22:58Z",
            environment: "development",
          },
          {
            ...baseApplicationData,
            id: 4,
            name: "Application 4",
            raisedDateTime: "2021-12-31T21:58Z",
            environment: "development",
          },
        ]}
      />
    );
  });

  describe("deriving issues from application environment values", () => {
    it("should not set duplicate filters", () => {
      const filters = screen.queryAllByLabelText("Filter item");

      expect(filters.length).toBe(3);
    });

    it("should order the filters in alphabetical ascending order", () => {
      const filters = screen.queryAllByLabelText("Filter item");

      expect(filters[0]).toHaveTextContent("development");
      expect(filters[1]).toHaveTextContent("production");
      expect(filters[2]).toHaveTextContent("staging");
    });
  });

  describe("default filtering", () => {
    it("should not filter issues by default", () => {
      expect(screen.getByText("Application 1")).toBeInTheDocument();
      expect(screen.getByText("Application 2")).toBeInTheDocument();
      expect(screen.getByText("Application 3")).toBeInTheDocument();
      expect(screen.getByText("Application 4")).toBeInTheDocument();
    });
  });

  describe("on selection of any number of filters", () => {
    it("should render the issues relative to the selected filter in the correct sorting order", () => {
      userEvent.click(screen.getByLabelText("Show filters"));
      userEvent.click(screen.getByLabelText("development"));

      const issues = screen.queryAllByLabelText("name");

      expect(issues.length).toBe(2);
      expect(issues[0]).toHaveTextContent("Application 4");
      expect(issues[1]).toHaveTextContent("Application 3");
    });
  });

  describe("on selection of a single filter", () => {
    it("should indicate to the user the active filter", async () => {
      userEvent.click(screen.getByLabelText("Show filters"));
      userEvent.click(screen.getByLabelText("development"));

      expect(screen.getByLabelText("development")).toBeChecked();
      expect(screen.getByLabelText("production")).not.toBeChecked();
      expect(screen.getByLabelText("staging")).not.toBeChecked();
    });

    it("should filter the issues relative to the selected filter", () => {
      userEvent.click(screen.getByLabelText("Show filters"));
      userEvent.click(screen.getByLabelText("development"));

      expect(screen.queryByText("Application 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Application 2")).not.toBeInTheDocument();
      expect(screen.getByText("Application 3")).toBeInTheDocument();
      expect(screen.getByText("Application 4")).toBeInTheDocument();
    });
  });

  describe("on selection of multiple filters", () => {
    it("should indicate to the user the active filters", () => {
      userEvent.click(screen.getByLabelText("Show filters"));
      userEvent.click(screen.getByLabelText("production"));
      userEvent.click(screen.getByLabelText("development"));

      expect(screen.getByLabelText("development")).toBeChecked();
      expect(screen.getByLabelText("production")).toBeChecked();
      expect(screen.getByLabelText("staging")).not.toBeChecked();
    });

    it("should filter the issues relative to the selected filters", () => {
      userEvent.click(screen.getByLabelText("Show filters"));
      userEvent.click(screen.getByLabelText("production"));
      userEvent.click(screen.getByLabelText("development"));

      expect(screen.queryByText("Application 1")).toBeInTheDocument();
      expect(screen.getByText("Application 3")).toBeInTheDocument();
      expect(screen.getByText("Application 4")).toBeInTheDocument();
      expect(screen.queryByText("Application 2")).not.toBeInTheDocument();
    });
  });

  describe("deselecting an active filter", () => {
    it("should indicate to the user the filter is not longer active", () => {
      userEvent.click(screen.getByLabelText("Show filters"));
      userEvent.click(screen.getByLabelText("development"));

      expect(screen.getByLabelText("development")).toBeChecked();

      userEvent.click(screen.getByLabelText("development"));

      expect(screen.getByLabelText("development")).not.toBeChecked();
    });

    it("should filter the issues relative to the change of the active filter", () => {
      userEvent.click(screen.getByLabelText("Show filters"));
      userEvent.click(screen.getByLabelText("development"));

      expect(screen.queryByText("Application 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Application 2")).not.toBeInTheDocument();
      expect(screen.getByText("Application 3")).toBeInTheDocument();
      expect(screen.getByText("Application 4")).toBeInTheDocument();

      userEvent.click(screen.getByLabelText("development"));

      expect(screen.getByText("Application 1")).toBeInTheDocument();
      expect(screen.getByText("Application 2")).toBeInTheDocument();
      expect(screen.getByText("Application 3")).toBeInTheDocument();
      expect(screen.getByText("Application 4")).toBeInTheDocument();
    });
  });
});

describe("ComplianceTable - toggling additional row data", () => {
  beforeEach(() => {
    render(
      <ComplianceTable
        applications={[
          {
            ...baseApplicationData,
          },
          {
            ...baseApplicationData,
            id: 2,
            name: "Application 2",
            raisedDateTime: "2021-12-31T23:48Z",
            environment: "staging",
          },
          {
            ...baseApplicationData,
            id: 3,
            name: "Application 3",
            raisedDateTime: "2021-12-31T22:58Z",
            environment: "development",
          },
          {
            ...baseApplicationData,
            id: 4,
            name: "Application 4",
            raisedDateTime: "2021-12-31T21:58Z",
            environment: "development",
          },
        ]}
      />
    );
  });

  describe("default additional row display", () => {
    it("should set all rows to collapsed by default", () => {
      const collapsedRows = screen.queryAllByLabelText("Expand row");

      expect(collapsedRows.length).toBe(4);
    });
  });

  describe("expanding a single row", () => {
    it("should indicate to the user via the toggle UI that the row is expanded", () => {
      userEvent.click(screen.queryAllByLabelText("Expand row")[0]);

      expect(screen.queryAllByLabelText("Collapse row").length).toBe(1);
      expect(screen.queryAllByLabelText("Expand row").length).toBe(3);
    });

    it("should expand the selected row", () => {
      userEvent.click(screen.queryAllByLabelText("Expand row")[0]);

      const expandedRowContent = screen.queryAllByText(/James Brown/i);

      expect(expandedRowContent[0]).toBeVisible();

      [...expandedRowContent.slice(1)].forEach((item) => {
        expect(item).not.toBeVisible();
      });
    });
  });

  describe("expanding multiple rows", () => {
    it("should indicate to the user via the toggle UI that the selected rows are expanded", () => {
      const rowToggles = screen.queryAllByLabelText("Expand row");

      userEvent.click(rowToggles[0]);
      userEvent.click(rowToggles[1]);

      expect(screen.queryAllByLabelText("Collapse row").length).toBe(2);
      expect(screen.queryAllByLabelText("Expand row").length).toBe(2);
    });

    it("should expand the selected rows", () => {
      const rowToggles = screen.queryAllByLabelText("Expand row");

      userEvent.click(rowToggles[0]);
      userEvent.click(rowToggles[1]);

      const expandedRowContent = screen.queryAllByText(/James Brown/i);

      [...expandedRowContent.slice(0, 2)].forEach((item) => {
        expect(item).toBeVisible();
      });

      [...expandedRowContent.slice(2)].forEach((item) => {
        expect(item).not.toBeVisible();
      });
    });
  });

  describe("collapsing a row", () => {
    it("should indicate to the user via the toggle UI that the selected row is collapsed", () => {
      userEvent.click(screen.queryAllByLabelText("Expand row")[0]);

      expect(screen.queryAllByLabelText("Collapse row").length).toBe(1);
      expect(screen.queryAllByLabelText("Expand row").length).toBe(3);

      userEvent.click(screen.queryAllByLabelText("Collapse row")[0]);

      expect(screen.queryAllByLabelText("Collapse row").length).toBe(0);
      expect(screen.queryAllByLabelText("Expand row").length).toBe(4);
    });
  });
});

describe("ComplianceTable - with one issue", () => {
  beforeEach(() => {
    render(<ComplianceTable applications={[{ ...baseApplicationData }]} />);
  });

  it("should not render the filter UI", () => {
    expect(screen.queryByLabelText("Show filters")).not.toBeInTheDocument();
  });

  it("should not render the sorting UI", () => {
    expect(screen.queryByLabelText("Sort by age")).not.toBeInTheDocument();
  });
});

describe("ComplianceTable - with no issues", () => {
  it("should display a feedback message to the user", () => {
    render(<ComplianceTable applications={[]} />);

    expect(
      screen.getByLabelText("Compliance Table no issues feedback")
    ).toBeInTheDocument();
  });

  it("should not display the compliance table", () => {
    render(<ComplianceTable applications={[]} />);

    expect(screen.queryByLabelText("Compliance table")).not.toBeInTheDocument();
  });
});
