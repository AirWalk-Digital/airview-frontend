import siteConfig from "../site-config.json";
import { GithubClient, AdoClient } from "./remote-clients";

export function getContentBackendConfig() {
  const initialState = {
    error: false,
    previewMode: false,
    routeRepoData: siteConfig.contentRepositories,
    editMode: false,
  };

  const backendClientConfig = {
    authCallbackRoute: `${process.env.REACT_APP_API_HOST}/gitproxy/create-${process.env.REACT_APP_CONTENT_BACKEND}-access-token`,
    clientId: process.env.REACT_APP_CONTENT_CLIENT_ID,
    redirect_uri: `${process.env.REACT_APP_CONTENT_CALLBACK_URL}`,
    authScope: "repo", //normally defaults to 'public_repo'
    organisation: `${process.env.REACT_APP_CONTENT_ORGANISATION}`,
    project: `${process.env.REACT_APP_CONTENT_PROJECT}`,
  };

  let client;
  switch (process.env.REACT_APP_CONTENT_BACKEND) {
    case "github":
      client = new GithubClient(backendClientConfig);
    case "ado":
      client = new AdoClient(backendClientConfig);
  }

  return { initialState, client };
}
