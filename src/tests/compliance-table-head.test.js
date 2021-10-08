import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComplianceTableHead } from "../components/compliance-table/compliance-table-head";

describe("ComplianceTableHead", () => {
  describe("with sortable prop set to 'true' and age order 'asc'", () => {
    beforeEach(() => {
      render(
        <ComplianceTableHead
          ageOrder="asc"
          sortable={true}
          onSortClick={() => {}}
        />
      );
    });

    it("should detail the sorting order as asc in the helper label", () => {
      expect(screen.getByLabelText("Sorting order")).toHaveTextContent(
        /^Age sorted ascending$/
      );
    });
  });

  describe("with sortable prop set to 'true' and age order 'desc'", () => {
    beforeEach(() => {
      render(
        <ComplianceTableHead
          ageOrder="desc"
          sortable={true}
          onSortClick={() => {}}
        />
      );
    });

    it("should detail the sorting order as desc in the helper label", () => {
      expect(screen.getByLabelText("Sorting order")).toHaveTextContent(
        /^Age sorted descending$/
      );
    });
  });

  describe("with sortable prop set to 'true' and on click of the toggle sort order UI", () => {
    const handleOnSortClick = jest.fn();

    beforeEach(() => {
      render(
        <ComplianceTableHead
          ageOrder="desc"
          sortable={true}
          onSortClick={handleOnSortClick}
        />
      );
    });

    afterEach(() => {
      handleOnSortClick.mockClear();
    });

    it("should call the passed callback function to handle sort order changes", () => {
      userEvent.click(screen.getByLabelText("Sort by age"));

      expect(handleOnSortClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("with sortable prop set to 'false", () => {
    beforeEach(() => {
      render(
        <ComplianceTableHead
          ageOrder="desc"
          sortable={false}
          onSortClick={() => {}}
        />
      );
    });

    it("should not render the sorting UI", () => {
      expect(screen.queryByLabelText("Sort by age")).not.toBeInTheDocument();
    });

    it("should fallback to the display of a static table cell 'age' value", () => {
      expect(screen.getByText("Age")).toBeInTheDocument();
    });
  });
});
