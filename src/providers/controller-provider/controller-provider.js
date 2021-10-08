import React from "react";
import { useStore } from "../../store/store";
import { useApiService } from "../../hooks/use-api-service";
import * as matter from "gray-matter";
import { get } from "lodash-es";
import path from "path";

export const ControllerProviderContext = React.createContext();

export function ControllerProvider({ initialState, config, children, client }) {
  const {
    state,
    setErrorStatus,
    setPreviewModeStatus,
    setWorkingBranchName,
    resetWorkingBranchName,
  } = useStore(initialState);

  const apiService = useApiService();

  const getErrorStatus = () => {
    return state.error;
  };

  const toggleErrorStatus = () => {
    setErrorStatus(!state.error);
  };

  const getPreviewModeStatus = () => {
    return state.previewMode;
  };

  const setPreviewMode = async (status) => {
    if (status) {
      const authenticated = await client.isAuthenticated();

      if (!authenticated) {
        try {
          await client.authenticate();
          setPreviewModeStatus(true);
        } catch (error) {
          console.warn(error);
          setPreviewModeStatus(false);
        }
      } else {
        setPreviewModeStatus(true);
      }
    } else {
      setPreviewModeStatus(false);
    }
  };

  const togglePreviewModeStatus = async () => {
    await setPreviewMode(!state.previewMode);
  };

  const getWorkingRepoName = (route) => {
    return state.routeRepoData[route].workingRepoName;
  };

  const getWorkingBranchName = (route) => {
    return state.routeRepoData[route].workingBranchName;
  };

  const commitContent = async (route, filePath, content) => {
    for (let item of content) {
      await commitFile(
        route,
        path.join(filePath, item.fileName),
        item.blob,
        true
      );
    }
  };

  const commitFile = async (route, fileName, content) => {
    // accept md string and images array
    const repo = getWorkingRepoName(route);
    const branch = getWorkingBranchName(route);
    let sha = "";
    try {
      const githubData = await client.fetchFile(fileName, repo, branch, false);
      sha = githubData.sha;
    } catch (error) {
      if (error.status === 404) {
        sha = "";
      } else {
        throw error;
      }
    }

    const resp = await client.commit(fileName, sha, content, repo, branch);
    return resp;
  };

  const getFile = async (route, fileName) => {
    try {
      const response = await getRemoteFile(route, fileName);
      const markdown = await response.content.text();
      return matter(markdown);
    } catch (error) {
      // Eventually set error state to present error boundry UI
      throw error;
    }
  };

  const getMedia = async (route, fileName) => {
    try {
      const response = await getRemoteFile(route, fileName);
      return response.content;
    } catch (error) {
      // Eventually set error state to present error boundry UI
      throw error;
    }
  };

  const getRemoteFile = async (route, fileName) => {
    if (state.previewMode) {
      const repo = getWorkingRepoName(route);
      const branch = getWorkingBranchName(route);
      const githubData = await client.fetchFile(fileName, repo, branch);
      return githubData;
    }
    const staticStorageFolderName =
      state.routeRepoData[route].staticStorageFolderName;
    const markdownDataResp = await apiService(
      `${staticStorageFolderName}${fileName}`
    );
    return { content: markdownDataResp.data, sha: "" };
  };

  const getBranches = async (route) => {
    if (!state.previewMode) return [];
    const repo = getWorkingRepoName(route);
    const branch = getWorkingBranchName(route);
    const branches = await client.getBranchList(repo, branch);
    return branches;
  };

  const createBranch = async (route, name) => {
    const repo = getWorkingRepoName(route);
    const branch = getWorkingBranchName(route);

    try {
      const remoteBranches = await getBranches(route);

      if (remoteBranches.find((branch) => branch.name === name)) {
        setWorkingBranchName(route, name);
        return;
      }

      const resp = await client.createBranch(name, repo, branch);

      if (resp.node_id !== undefined || resp.value[0].success) {
        setWorkingBranchName(route, name);
      } else {
        throw new Error("Could not create branch");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getListing = async (route, path) => {
    //TO DO: This needs to have a preview version
    let listingData;
    if (state.previewMode) {
      const repo = getWorkingRepoName(route);
      const branch = getWorkingBranchName(route);
      const resp = await client.fetchFile("listing.json", repo, branch);
      listingData = await resp.content.text();
    } else {
      const staticStorageFolderName =
        state.routeRepoData[route].staticStorageFolderName;
      const listingDataResp = await apiService(
        `${staticStorageFolderName}/listing.json`
      );
      listingData = await listingDataResp.data.text();
    }
    // Temp addition to allow commiting of content for new page creation
    if (!path) return JSON.parse(listingData);

    return get(JSON.parse(listingData), path.split("/"), {});
  };

  return (
    <ControllerProviderContext.Provider
      value={{
        getErrorStatus,
        setErrorStatus,
        toggleErrorStatus,
        getPreviewModeStatus,
        setPreviewModeStatus: setPreviewMode,
        togglePreviewModeStatus,
        getWorkingRepoName,
        getWorkingBranchName,
        setWorkingBranchName,
        resetWorkingBranchName,
        getFile,
        getMedia,
        getBranches,
        getListing,
        createBranch,
        commitContent,
        commitFile, // Temp addition to allow commiting of content for new page creation
      }}
    >
      {children}
    </ControllerProviderContext.Provider>
  );
}
