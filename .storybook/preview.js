import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { materialUiTheme } from "../src/lib/material-ui-theme";
import { makeStyles } from "@material-ui/core/styles";
import { create } from "jss";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import compose from "jss-plugin-compose";
import { initializeWorker, mswDecorator } from "msw-storybook-addon";
import { BrowserRouter as Router } from "react-router-dom";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "centered",
};

initializeWorker();

export const decorators = [
  mswDecorator,
  (Story) => {
    const jss = create({
      plugins: [...jssPreset().plugins, compose()],
    });

    return (
      <Router>
        <ThemeProvider theme={materialUiTheme}>
          <StylesProvider jss={jss}>
            <CssBaseline />
            <Story />
          </StylesProvider>
        </ThemeProvider>
      </Router>
    );
  },
];
