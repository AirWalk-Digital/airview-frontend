import React from "react";
import { render, screen } from "@testing-library/react";
import { IconChip } from "../components/icon-chip";
import WarningIcon from "@material-ui/icons/Warning";

describe("IconChip", () => {
  beforeEach(() => {
    render(
      <IconChip
        icon={<WarningIcon aria-label="Test Icon" />}
        label="Test Label"
      />
    );
  });

  describe("with a valid icon passed to the icon prop", () => {
    it("should set the icon equal to the value passed to the icon prop", () => {
      expect(screen.getByLabelText("Test Icon")).toBeInTheDocument();
    });
  });

  describe("with a valid string passed to the label prop", () => {
    it("set the label text equal to the value passed to the label prop", () => {
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });
  });

  describe("with a value passed to the classNames prop", () => {
    it("should apply classnames equal to the value passed to the classNames prop", () => {
      const { container } = render(
        <IconChip
          icon={<WarningIcon aria-label="Test Icon" />}
          label="Test Label"
          classNames="test-class-name"
        />
      );

      expect(container.firstChild.className).toEqual(
        expect.stringContaining("test-class-name")
      );
    });
  });
});
