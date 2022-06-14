/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

// export * from "./authenticate";
import { authenticate } from "./authenticate";
import {
  Branch as BranchBase,
  GithubClientOptions as GithubClientOptionsBase,
} from "../interfaces";
import { AirviewApiError } from "../../error";

export interface GithubClientOptions extends GithubClientOptionsBase {
  organisation: string;
  project: string;
  state: string;
}

export interface Branch extends BranchBase {
  objectId: string;
}

export class GithubClient {
  organisation: string;
  project: string;
  proxy: string;
  clientId: string;
  authCallbackRoute: string;
  redirect_uri: string;
  authScope: string = "vso.code_write";
  defaultCommitMessage: string;

  constructor({
    organisation,
    project,
    proxy,
    clientId,
    authCallbackRoute,
    redirect_uri,
    defaultCommitMessage = "Automated documentation update",
  }: GithubClientOptions) {
    this.organisation = organisation;
    this.project = project;
    this.authCallbackRoute = authCallbackRoute;
    this.redirect_uri = redirect_uri;
    this.proxy = proxy;
    this.clientId = clientId;
    this.authCallbackRoute = authCallbackRoute;
    this.defaultCommitMessage = defaultCommitMessage;
    this.validate();
  }

  authenticate() {
    return authenticate(
      this.clientId,
      this.authCallbackRoute,
      this.authScope,
      this.redirect_uri
    );
  }

  isAuthenticated() {
    return this.getRepoList();
  }

  async isAuthorized(repo: string): Promise<boolean> {
    try {
      const repoObj = await this.getRepository(repo);
      return repoObj.id;
    } catch {
      return false;
    }
  }

  async getRepoList() {
    //https://docs.microsoft.com/en-us/rest/api/azure/devops/git/repositories/get%20repository?view=azure-devops-rest-6.1

    try {
      const data = await this.req({
        url: `https://dev.azure.com/${this.organisation}/${this.project}/_apis/git/repositories/?api-version=6.1-preview.1`,
        method: "GET",
      });
      return data.count !== undefined;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  getRepository(repo: string) {
    return this.req({
      url: `https://dev.azure.com/${this.organisation}/${this.project}/_apis/git/repositories/${repo}?api-version=6.1-preview.1`,
    });
  }

  async createPR(repo: string, baseBranch: string, sourceBranch: string) {
    const info = `Pull ${sourceBranch} into ${baseBranch}`;
    const data = await this.req({
      url:
        `https://dev.azure.com/${this.organisation}/${this.project}/_apis/git/repositories/` +
        `${repo}/pullrequests?api-version=6.1-preview.1`,
      method: "POST",
      headers: { "content-type": "application/json" },
      data: {
        sourceRefName: `refs/heads/${sourceBranch}`,
        targetRefName: `refs/heads/${baseBranch}`,
        title: info,
        description: info,
      },
    });

    return `${data.repository.webUrl}/pullrequest/${data.pullRequestId}`;
  }
  async fetchExistingPR(
    repo: string,
    sourceBranch: string,
    targetBranch: string
  ) {
    const res = await this.req({
      url:
        `https://dev.azure.com/${this.organisation}/${this.project}/_apis/git/repositories/` +
        `${repo}/pullrequests?api-version=6.1-preview.1`,
      method: "GET",
    });

    const prList = res.value;

    for (let i = 0; i < prList.length; i++) {
      const pull = prList[i];
      if (
        pull.sourceRefName === `refs/heads/${sourceBranch}` &&
        pull.targetRefName === `refs/heads/${targetBranch}`
      ) {
        return pull; // found matching PR
      }
    }
    return;
  }

  async getBranch(repo: string, branch: string) {
    const data = await this.req({
      url:
        `https://dev.azure.com/${this.organisation}/${this.project}` +
        `/_apis/git/repositories/${repo}/refs?filter=heads/${branch}&api-version=6.1-preview.1`,
      method: "GET",
    });
    const val = data.value;
    const b = await this.createBranchObject(val[0]);

    return b;

    // TODO
    // if (data.ref.startsWith('refs/heads/')) {
    //   //check if branch, and not tag
    //   return data
    // }
    // return // Bubble up error here?
  }

  async getBranchList(repo: string): Promise<Branch[]> {
    const data = await this.req({
      url:
        `https://dev.azure.com/${this.organisation}/${this.project}` +
        `/_apis/git/repositories/${repo}/refs?filter=heads/&api-version=6.1-preview.1`,
      method: "GET",
    });

    var branch_list: Branch[] = [];

    for (let val of data.value) {
      const b = await this.createBranchObject(val);
      branch_list.push(b);
    }

    return branch_list;
  }

  async createBranchObject(val: any): Promise<Branch> {
    const brName = val.name.split("/")[2];
    const repoId = val.url.split("/")[8];
    const objectId = val.objectId;

    var policies = await this.req({
      url: `https://dev.azure.com/${this.organisation}/${this.project}/_apis/git/policy/configurations?repositoryId=${repoId}&refName=${val.name}&api-version=6.1-preview.1`,
      method: "GET",
    });

    var isProtected = true;
    if (policies.count === 0) {
      isProtected = false;
    }

    var b = {
      name: brName,
      protected: isProtected,
      objectId: objectId,
    };

    return b;
  }

  async createBranch(name: string, repo: string, sourceBranch: string) {
    const branch = await this.getBranch(repo, sourceBranch);
    const sha = branch.objectId;
    const response = await this.req({
      url:
        `https://dev.azure.com/${this.organisation}/${this.project}` +
        `/_apis/git/repositories/${repo}/refs?api-version=6.1-preview.1`,
      method: "POST",
      headers: { "content-type": "application/json" },
      data: [
        {
          name: `refs/heads/${name}`,
          oldObjectId: "0000000000000000000000000000000000000000",
          newObjectId: `${sha}`,
        },
      ],
    });

    return response;
  }

  async commit(
    filePath: string,
    sha: string,
    fileContents: Blob,
    repo: string,
    branch: string,
    commitMessage: string = this.defaultCommitMessage
  ) {
    var br: Branch = await this.getBranch(repo, branch);

    let branchObjId = br.objectId;

    var action = "edit";
    if (sha == null || sha == "") {
      action = "add";
    }
    const blobToBase64 = (blob: Blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          const s = reader.result as string;
          const b64Encoded = s.replace(/^data:[a-z/*]+;base64,/, "");
          resolve(b64Encoded);
        };
      });
    };

    const b64Contents = await blobToBase64(fileContents);

    var response = await this.req({
      url:
        `https://dev.azure.com/${this.organisation}/${this.project}` +
        `/_apis/git/repositories/${repo}/pushes?api-version=6.1-preview.2`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        refUpdates: [
          {
            name: `refs/heads/${br.name}`,
            oldObjectId: branchObjId,
          },
        ],
        commits: [
          {
            comment: commitMessage,
            changes: [
              {
                changeType: action,
                item: {
                  path: filePath,
                },
                newContent: {
                  content: b64Contents,
                  contentType: "base64Encoded",
                },
              },
            ],
          },
        ],
      },
    });
    response.content = {};
    response.content.sha = response.commits[0].commitId;
    return response;
  }

  // async fetchFileList(filePath: string, repo: string, branch: string) {
  //   const request = await this.req({
  //     url:
  //       `https://dev.azure.com/${this.organisation}/${this.project}/_apis/git` +
  //       `/repositories/${repo}/items?versionType=Branch&version=${branch}&scopePath=${filePath}` +
  //       `&recursionLevel=OneLevel&includeLinks=true&api-version=6.1-preview.1`,
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //     },
  //   });
  //
  //   const fileList = [];
  //
  //   for (var f of request.value) {
  //     if (f.isFolder) {
  //       continue;
  //     }
  //     f.sha = f.objectId;
  //     if (f.path.startsWith("/")) {
  //       f.path = f.path.substring(1);
  //     }
  //     f.name = f.path.split("/").pop();
  //     f.type = "file";
  //     f.download_url = f._links.blob.href;
  //     fileList.push(f);
  //   }
  //
  //   return fileList;
  // }
  //
  async fetchFile(filePath: string, repo: string, branch: string) {
    const request = await this.req({
      url:
        `https://dev.azure.com/${this.organisation}/${this.project}/_apis/git` +
        `/repositories/${repo}/items?versionType=Branch&version=${branch}&path=${filePath}` +
        `&includeContent=false&api-version=6.1-preview.1`,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!request.isFolder) {
      const fileInfo = await this.fetchJson(request.url);
      const blob = await this.fetchBlob(request.url);
      return { content: blob, sha: fileInfo.objectId };
    }
    return await this.fetchTree(request._links.tree.href, filePath);
  }

  async fetchTree(url: string, filePath: string) {
    const request = await this.req({
      url: url,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const mapped = request.treeEntries.map((x: any) => ({
      name: x.relativePath,
      path: `${filePath}/${x.relativePath}`,
      type: x.gitObjectType === "tree" ? "dir" : "file",
    }));
    return mapped;
  }

  blobToBase64 = (blob: any) => {
    const reader = new FileReader();

    reader.readAsDataURL(blob);
    // reader.readAsText(blob, "UTF-8");
    return new Promise<string>((resolve) => {
      reader.onloadend = () => {
        var base64data = reader.result;
        if (reader !== null && reader.result !== null) {
          resolve((reader.result as string).split(",")[1]);
        }
      };
    });
  };
  async fetchBlob(url: string) {
    const data = {
      url: url, // `${url}&includeContent=true`,
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
      },
    };
    const response = await this.proxyRequest(data);
    const blob = await response.blob();
    return blob;
  }
  async fetchJson(url: string) {
    const data = {
      url: `${url}&includeContent=false`,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };
    const response = await this.proxyRequest(data);

    const j = await response.json();

    return j;
  }

  async checkFileExist(filePath: string, repo: string, branch: string) {
    var request;
    try {
      request = await this.req({
        url:
          `https://dev.azure.com/${this.organisation}/${this.project}/_apis/git` +
          `/repositories/${repo}/items?versionType=Branch&version=${branch}&path=${filePath}` +
          `&includeContent=false&api-version=6.1-preview.1`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
    } catch {
      return false;
    }
    if (request) {
      return true;
    }
    return false;
  }

  /*
  added or deletes files from github
  */
  async githubFileApi(
    path: string,
    fileContents: string,
    commitMessage: string = "Update from TinaCMS",
    encoded: boolean = false,
    action: "edit" | "add" | "delete",
    repo: string,
    branch: string
  ) {
    var br: Branch = await this.getBranch(repo, branch);

    let branchObjId = br.objectId;

    var contentType = "rawtext";
    if (encoded) {
      contentType = "base64encoded";
    }

    return this.req({
      url:
        `https://dev.azure.com/${this.organisation}/${this.project}` +
        `/_apis/git/repositories/${repo}/pushes?api-version=6.1-preview.2`,
      method: "POST",
      headers: "Accept: application/json",
      data: {
        refUpdates: [
          {
            name: `refs/heads/${br.name}`,
            oldObjectId: branchObjId,
          },
        ],
        commits: [
          {
            comment: commitMessage,
            changes: [
              {
                changeType: action,
                item: {
                  path: path,
                },
                newContent: {
                  content: fileContents,
                  contentType: contentType,
                },
              },
            ],
          },
        ],
      },
    });
  }

  async upload(
    path: string,
    fileContents: string,
    repo: string,
    branch: string,
    commitMessage: string = "Update from TinaCMS",
    encoded: boolean = false
  ) {
    var isFileExist = await this.checkFileExist(path, repo, branch);

    if (isFileExist) {
      await this.githubFileApi(
        path,
        fileContents,
        commitMessage,
        encoded,
        "edit",
        repo,
        branch
      );
    } else {
      await this.githubFileApi(
        path,
        fileContents,
        commitMessage,
        encoded,
        "add",
        repo,
        branch
      );
    }

    var fileObj = await this.fetchFile(path, repo, branch);

    var item = { content: {} } as any;
    item.content.name = fileObj.path.split("/").pop();
    item.content.path = fileObj.path;
    item.content.size = 100;
    item.content.type = "file";
    item.content.url = fileObj.url;
    item.content.download_url = fileObj.url;

    return item;
  }

  async delete(
    path: string,
    commitMessage: string = `Deleted ${path} using TinaCMS`,
    repo: string,
    branch: string
  ) {
    return this.githubFileApi(
      path,
      "",
      commitMessage,
      false,
      "delete",
      repo,
      branch
    );
  }

  protected async req(data: any) {
    const response = await this.proxyRequest(data);
    return this.getADOResponse(response);
  }

  protected async getADOResponse(response: Response) {
    const data = await response.json();
    //2xx status codes
    if (response.status.toString()[0] === "2") return data;

    throw new AirviewApiError(
      data.message || response.statusText,
      response.status
    );
  }

  private validate(): void {
    const errors = [];
    if (!this.authCallbackRoute) {
      errors.push("Missing `authCallbackRoute`");
    }
    if (!this.clientId) {
      errors.push(
        "Missing `clientId`. It may not have been set in environment variables."
      );
    }
    if (errors.length) {
      throw new Error(createErrorMessage(errors));
    }
  }

  /**
   * The methods below maybe don't belong on GitHub client, but it's fine for now.
   */

  private proxyRequest(data: any) {
    // For implementations using the csrf mitigation
    const token = localStorage.getItem("tinacms-github-token") || null;

    const headers = { ...data.headers, authorization: `Bearer ${token}` };
    const body = JSON.stringify(data.data);
    return fetch(data.url, {
      method: data.method,
      headers: headers,
      body: body,
      cache: "no-cache",
    });
  }
}

const createErrorMessage = (
  errors: string[]
) => `Failed to create the TinaCMS GithubClient

${errors.map((error) => `\t* ${error}`).join("\n")}

Visit the setup guide for more information

\thttps://tinacms.org/guides/nextjs/github-open-authoring/configure-custom-app
`;
