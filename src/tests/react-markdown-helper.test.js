import React from "react";
import { render, screen } from "@testing-library/react";
import { ReactMarkdownHelper } from "../lib/markdown-helpers";

describe.skip("ReactMarkdownHelper - images", () => {
  describe("with preview mode disabled", () => {
    describe("with external hosted image", () => {
      const requireCallbackHandler = jest.fn().mockImplementation((path) => {
        return {
          default: path,
        };
      });

      const markdownContent = `![Test alt text](https://www.somehost.com/test-image.jpg)`;

      beforeEach(() => {
        render(
          <ReactMarkdownHelper
            preview={false}
            path="test-path/"
            requireCallback={requireCallbackHandler}
          >
            {markdownContent}
          </ReactMarkdownHelper>
        );
      });

      afterEach(() => {
        requireCallbackHandler.mockClear();
      });

      it("should set the image src attribute equal to the value in the markdown content", () => {
        expect(screen.getByRole("img")).toHaveAttribute(
          "src",
          "https://www.somehost.com/test-image.jpg"
        );
      });

      it("should output the correct alt value", () => {
        expect(screen.getByRole("img")).toHaveAttribute("alt", "Test alt text");
      });
    });

    describe("with self hosted image", () => {
      const requireCallbackHandler = jest.fn().mockImplementation((path) => {
        return {
          default: path,
        };
      });

      const markdownContent = `![Test alt text](test-image.jpg)`;

      beforeEach(() => {
        render(
          <ReactMarkdownHelper
            preview={false}
            path="test-path/"
            requireCallback={requireCallbackHandler}
          >
            {markdownContent}
          </ReactMarkdownHelper>
        );
      });

      afterEach(() => {
        requireCallbackHandler.mockClear();
      });

      it("should resolve the image src attribute", () => {
        expect(screen.getByRole("img")).toHaveAttribute(
          "src",
          "./test-path/test-image.jpg"
        );
      });

      it("should output the correct alt value two", () => {
        expect(screen.getByRole("img")).toHaveAttribute("alt", "Test alt text");
      });
    });
  });
});
