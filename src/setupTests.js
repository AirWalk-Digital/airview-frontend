// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { setGlobalConfig } from "@storybook/testing-react";
import * as globalStorybookConfig from "../.storybook/preview";
import { server } from "./api-mock/server";
import { configure } from "@testing-library/react";

configure({ asyncUtilTimeout: 3000 });

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

setGlobalConfig(globalStorybookConfig);

window.console.error = jest.fn();
window.console.warn = jest.fn();
window.fetch = require("node-fetch");

jest.setTimeout(30000);
