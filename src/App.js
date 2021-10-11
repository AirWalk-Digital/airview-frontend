import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { create } from "jss";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import compose from "jss-plugin-compose";
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { materialUiTheme } from "./lib/material-ui-theme";
import { HomePage } from "./pages/homepage";
import { ApplicationsIndexPage } from "./pages/applications-index-page";
import { ApplicationsPage } from "./pages/applications-page";
import { KnowledgePage } from "./pages/knowledge-page";
import { GithubAuthPage } from "./pages/github-auth-page";
import { SigninCallbackPage } from "./pages/signin-callback-page";
import { NotFoundPage } from "./pages/not-found-page";
import { ControllerProvider } from "./providers/controller-provider";
import { PrivateRoute } from "./components/private-route";
import { AuthProvider } from "oidc-react";
import { GithubClient } from "./lib/remote-clients";

// Move into lib
function getOidcConfig(history, location) {
  return {
    authority: process.env.REACT_APP_AUTH_AUTHORITY,
    clientId: process.env.REACT_APP_AUTH_CLIENT_ID,
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI,
    silent_redirect_uri: process.env.REACT_APP_AUTH_REDIRECT_URI,
    post_logout_redirect_uri: "/",
    responseType: "code",
    scope: `${process.env.REACT_APP_AUTH_SCOPE} openid profile`,
    automaticSilentRenew: true,
    skipUserInfo: true,
    loadUserInfo: false,
    onBeforeSignIn: function () {
      sessionStorage.setItem("location", location);
    },
    onSignIn: function () {
      history.push(sessionStorage.getItem("location"));
    },
    onSignOut: function () {
      sessionStorage.removeItem("location");
    },
  };
}

// Move into lib
const initialState = {
  error: false,
  previewMode: false,
  routeRepoData: {
    home: {
      workingRepoName: null,
      workingBranchName: null,
    },
    application: {
      /* workingRepoName: "airview", //for ado */
      workingRepoName: "AirWalk-Digital/airview_demo_applications", //for github
      workingBranchName: "main",
      staticStorageFolderName: "/storage/applications/",
    },
    knowledge: {
      workingRepoName: "AirWalk-Digital/airview_demo_applications",
      workingBranchName: "main",
      staticStorageFolderName: "/storage/applications/",
    },
  },
  editMode: false,
};

/*
const adoClientConfig = {
  authCallbackRoute: `${process.env.REACT_APP_API_HOST}/gitproxy/create-ado-access-token`,
  clientId: process.env.REACT_APP_ADO_CLIENT_ID,
  organisation: "mdrnwrk-ado",
  project: "airview",
  redirect_uri: `${process.env.REACT_APP_GIT_CALLBACK_URL}`,
};
*/

const githubClientConfig = {
  authCallbackRoute: `${process.env.REACT_APP_API_HOST}/gitproxy/create-github-access-token`,
  clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
  authScope: "repo", //normally defaults to 'public_repo'
  redirect_uri: `${process.env.REACT_APP_GIT_CALLBACK_URL}`,
};

/* const client = new AdoClient(adoClientConfig); */
const client = new GithubClient(githubClientConfig);

function App() {
  const jss = create({
    plugins: [...jssPreset().plugins, compose()],
  });

  const history = useHistory();
  const location = useLocation();

  return (
    <AuthProvider
      {...getOidcConfig(
        history,
        `${location.pathname}${location.hash}${location.search}`
      )}
    >
      <ControllerProvider {...{ initialState, client }}>
        <ThemeProvider theme={materialUiTheme}>
          <StylesProvider jss={jss}>
            <CssBaseline />

            <Switch>
              <PrivateRoute path="/" exact>
                <HomePage />
              </PrivateRoute>

              <PrivateRoute path="/applications" exact>
                <ApplicationsIndexPage />
              </PrivateRoute>

              <PrivateRoute
                path="/applications/:application_id"
                exact
                children={({ match }) => (
                  <ApplicationsPage key={match.params.application_id} />
                )}
              />

              <PrivateRoute
                path="/applications/:application_id/knowledge/:slug"
                exact
              >
                <KnowledgePage />
              </PrivateRoute>

              <Route path="/signin-callback">
                <SigninCallbackPage />
              </Route>

              <Route path="/github/authorizing" exact>
                <GithubAuthPage />
              </Route>

              <PrivateRoute>
                <NotFoundPage path="/not-found" />
              </PrivateRoute>

              <Redirect to="/not-found" />
            </Switch>
          </StylesProvider>
        </ThemeProvider>
      </ControllerProvider>
    </AuthProvider>
  );
}

export default App;
//Test
