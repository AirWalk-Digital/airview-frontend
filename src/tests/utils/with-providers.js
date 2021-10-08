import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@material-ui/core/styles";
import { materialUiTheme } from "../../lib/material-ui-theme";
import { BrowserRouter } from "react-router-dom";

function TestProviders({ children }) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={materialUiTheme}>{children}</ThemeProvider>
    </BrowserRouter>
  );
}

export function renderWithProviders(ui, { route = "/" } = {}) {
  window.history.pushState({}, "Test page", route);

  return render(ui, { wrapper: TestProviders });
}
