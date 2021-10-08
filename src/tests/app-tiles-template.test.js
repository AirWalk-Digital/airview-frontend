import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./utils/with-providers";
import {
  AppTilesTemplate,
  AppTilesTemplateHeader,
  AppTilesTemplateGrid,
  AppTilesTemplateGridItem,
  AppTilesTemplateLoadMoreItems,
} from "../components/app-tiles-template";

describe("AppTilesTemplate - default render", () => {
  const handleOnLoadMoreClick = jest.fn();

  beforeEach(() => {
    renderWithProviders(
      <AppTilesTemplate
        pageTitle="Test title"
        pageHeaderProps={{
          navItems: [],
          currentRoute: "",
          showEnableCmsButton: true,
          onEnableCmsClick: () => {},
        }}
      >
        <AppTilesTemplateHeader>
          <span>Header content</span>
        </AppTilesTemplateHeader>

        <AppTilesTemplateGrid>
          <AppTilesTemplateGridItem>Grid item content</AppTilesTemplateGridItem>
        </AppTilesTemplateGrid>

        <AppTilesTemplateLoadMoreItems
          buttonLabel="Load More"
          ariaLabel="Load more"
          onClick={handleOnLoadMoreClick}
          isLoading={false}
        />
      </AppTilesTemplate>
    );
  });

  afterEach(() => {
    handleOnLoadMoreClick.mockClear();
  });

  it("should render content passed to the AppTilesTemplateHeader sub-component", () => {
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("should render content passed to the AppTilesTemplateGridItem sub-component", () => {
    expect(screen.getByText("Grid item content")).toBeInTheDocument();
  });

  it("should render a button to load more items", () => {
    expect(
      screen.getByRole("button", { name: "Load more" })
    ).toBeInTheDocument();
  });
});
