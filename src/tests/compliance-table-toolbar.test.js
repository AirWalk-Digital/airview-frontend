import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComplianceTableToolbar } from "../components/compliance-table/compliance-table-toolbar";

describe("ComplianceTableToolbar", () => {
  describe("title", () => {
    describe("with title value set", () => {
      it("should output a title equal to the input value", () => {
        render(<ComplianceTableToolbar title="Test title" />);

        expect(screen.getByText("Test title")).toBeInTheDocument();
      });
    });

    describe("with no title value set", () => {
      it("should not output the title markup", () => {
        render(<ComplianceTableToolbar />);

        expect(screen.queryByRole("heading")).toBeNull();
      });
    });
  });

  describe("filters", () => {
    describe("with filter values set and greater than 1", () => {
      const handleOnFilterChange = jest.fn();

      beforeEach(() => {
        render(
          <ComplianceTableToolbar
            filters={["one", "two", "three"]}
            activeFilters={["one"]}
            onFilterChange={handleOnFilterChange}
            testid="toolbar"
          />
        );
      });

      afterEach(() => {
        handleOnFilterChange.mockClear();
      });

      it("should not display the filter list by default", () => {
        expect(screen.getByLabelText("Filters")).not.toBeVisible();
      });

      it("should display the filter list on click of the show filters button", () => {
        userEvent.click(screen.getByLabelText("Show filters"));

        expect(screen.getByLabelText("Filters")).toBeVisible();
      });

      it("should hide an open filter list on click of the show filters button", () => {
        expect(screen.getByLabelText("Filters")).not.toBeVisible();

        userEvent.click(screen.getByLabelText("Show filters"));

        expect(screen.getByLabelText("Filters")).toBeVisible();

        userEvent.click(screen.getByRole("presentation").firstChild);

        expect(screen.getByLabelText("Filters")).not.toBeVisible();
      });

      it("should display the filters, equal to the values passed", () => {
        const filters = screen.queryAllByLabelText("Filter item");

        expect(filters.length).toBe(3);
        expect(filters[0]).toHaveTextContent("one");
        expect(filters[1]).toHaveTextContent("two");
        expect(filters[2]).toHaveTextContent("three");
      });

      it("should indicate the active filters", () => {
        userEvent.click(screen.getByLabelText("Show filters"));

        const filterInputs = screen.queryAllByRole("checkbox", {
          checked: true,
        });

        expect(filterInputs.length).toBe(1);
        expect(filterInputs[0]).toBeChecked();
      });

      it("should call the provided callback on click of a filter, with the argument equal to the filter value", () => {
        userEvent.click(screen.getByLabelText("two"));

        expect(handleOnFilterChange).toHaveBeenCalledTimes(1);
        expect(handleOnFilterChange).toHaveBeenCalledWith("two");
      });
    });

    describe("with filter values set and less than 2", () => {
      it("should not display the filter UI", () => {
        render(<ComplianceTableToolbar filters={["one"]} />);

        expect(screen.queryByLabelText("Filters")).toBeNull();
      });
    });
  });

  describe("with no title and no filters set", () => {
    it("should not render the toolbar UI", () => {
      render(<ComplianceTableToolbar testid="toolbar" />);

      expect(screen.queryByTestId("toolbar")).toBeNull();
    });
  });

  describe("with no title set and filters length less than 2", () => {
    it("should not render the toolbar UI", () => {
      render(<ComplianceTableToolbar testid="toolbar" filters={["one"]} />);

      expect(screen.queryByTestId("toolbar")).toBeNull();
    });
  });
});
