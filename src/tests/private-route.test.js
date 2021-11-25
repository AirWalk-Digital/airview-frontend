import React from "react";
import { screen } from "@testing-library/react";
import { useAuth } from "oidc-react";
import { Router, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { PrivateRoute } from "../components/private-route";
import { renderWithProviders } from "./utils/with-providers";

jest.mock("oidc-react");

function setupComponent(contentText, mockReturnValue) {
  const history = createMemoryHistory();
  history.push("/test-path");

  useAuth.mockReturnValue(mockReturnValue);

  renderWithProviders(
    <Router history={history}>
      <Switch>
        <PrivateRoute exact path="/test-path">
          <h1>{contentText}</h1>
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

describe("PrivateRoute", () => {
  test("a user can reach a private route when authorsed", () => {
    const contentText = "Private content";

    setupComponent(contentText, { userData: true });

    expect(screen.getByText(contentText)).toBeInTheDocument();
  });

  test("a user can not reach a private route when not authorsed", () => {
    const contentText = "Private content";

    setupComponent(contentText, { userData: null });

    expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  });
});
