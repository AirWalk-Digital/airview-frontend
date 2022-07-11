/**

Copyright 2021 Forestry.io Holdings, Inc.

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

import { authenticate } from "./authenticate";

import { b64EncodeUnicode } from "./base64";
import { GithubClientOptions, Branch, AuthScope } from "../interfaces";
import mime from "mime";
import { AirviewApiError } from "../../error";
export * from "./authenticate";

function removeLeadingSlash(path: string) {
  if (path.charAt(0) === "/") {
    return path.substring(1);
  }
  return path;
}

export class GithubClient {
  proxy: string;
  clientId: string;
  authCallbackRoute: string;
  authScope: AuthScope;
  redirect_uri: string;
  defaultCommitMessage: string;

  constructor({
    proxy,
    clientId,
    authCallbackRoute,
    redirect_uri,
    authScope = "public_repo",
    defaultCommitMessage = "Automated documentation update",
  }: GithubClientOptions) {
    this.proxy = proxy;
    this.clientId = clientId;
    this.authCallbackRoute = authCallbackRoute;
    this.authScope = authScope;
    this.redirect_uri = redirect_uri;
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
    return this.getUser();
  }

  async isAuthorized(): Promise<boolean> {
    try {
      const repo = await this.getRepository("");

      return repo.permissions.push;
    } catch {
      return false;
    }
  }

  async getUser() {
    try {
      const data = await this.req({
        url: `https://api.github.com/user`,
        method: "GET",
      });

      return data;
    } catch (e: any) {
      if ((e.status = 401)) {
        return;
      }
      throw e;
    }
  }

  getRepository(repo: string) {
    return this.req({
      url: `https://api.github.com/repos/${repo}`,
    });
  }

  async createPR(repo: string, baseBranch: string, sourceBranch: string) {
    const info = `Pull ${sourceBranch} into ${baseBranch}`;
    const data = await this.req({
      url: `https://api.github.com/repos/${repo}/pulls`,
      method: "POST",
      data: {
        title: info,
        body: info,
        head: `${repo.split("/")[0]}:${sourceBranch}`,
        base: baseBranch,
      },
    });
    return data.html_url;
  }
  /**
   * @deprecated Call GithubClient#checkout instead
   */
  async fetchExistingPR(
    repo: string,
    sourceBranch: string,
    targetBranch: string
  ) {
    const branches = await this.req({
      url: `https://api.github.com/repos/${repo}/pulls`,
      method: "GET",
    });

    for (let i = 0; i < branches.length; i++) {
      const pull = branches[i];
      if (targetBranch === pull.head.ref) {
        if (
          pull.head.repo?.full_name === sourceBranch &&
          pull.base.repo?.full_name === targetBranch
        ) {
          return pull; // found matching PR
        }
      }
    }

    return;
  }

  async getBranch(repo: string, branch: string) {
    try {
      const data = await this.req({
        url: `https://api.github.com/repos/${repo}/git/ref/heads/${branch}`,
        method: "GET",
      });
      return data;
    } catch (e: any) {
      if ((e.status = 404)) {
        return;
      }
      throw e;
    }

    // TODO
    // if (data.ref.startsWith('refs/heads/')) {
    //   //check if branch, and not tag
    //   return data
    // }
    // return // Bubble up error here?
  }

  async getBranchList(repo: string): Promise<Branch[]> {
    return await this.req({
      url: `https://api.github.com/repos/${repo}/branches`,
      method: "GET",
    });
  }

  async createBranch(name: string, repo: string, sourceBranch: string) {
    const currentBranch = await this.getBranch(repo, sourceBranch);
    const sha = currentBranch.object.sha;
    const response = await this.req({
      url: `https://api.github.com/repos/${repo}/git/refs`,
      method: "POST",
      data: {
        ref: `refs/heads/${name}`,
        sha,
      },
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

    const response = await this.req({
      url: `https://api.github.com/repos/${repo}/contents/${removeLeadingSlash(
        filePath
      )}`,
      method: "PUT",
      data: {
        message: commitMessage,
        content: b64Contents, //encoded ? fileContents : b64EncodeUnicode(b64Contents),
        sha,
        branch: branch,
      },
    });
    return response;
  }

  // async getDownloadUrl(path: string): Promise<string> {
  // const res = await this.fetchFile(path, false);
  // return res.download_url;
  // }

  async fetchFile(filePath: string, repo: string, branch: string) {
    const mimeType = mime.getType(filePath);
    const request = await this.req({
      url: `https://api.github.com/repos/${repo}/contents/${removeLeadingSlash(
        filePath
      )}?ref=${branch}`,
      method: "GET",
    });

    const content = await (
      await fetch(`data:${mimeType};base64,${request.content}`)
    ).blob();
    return { content, sha: request.sha };
  }

  /*
  added or deletes files from github
  */
  async githubFileApi(
    path: string,
    fileContents: string,
    commitMessage: string = this.defaultCommitMessage,
    encoded: boolean = false,
    method: "PUT" | "DELETE",
    repo: string,
    branch: string
  ) {
    let sha = null;
    try {
      ({ sha } = await this.fetchFile(path, repo, branch));
    } catch (e) {}

    return this.req({
      url: `https://api.github.com/repos/${repo}/contents/${removeLeadingSlash(
        path
      )}`,
      method,
      data: {
        message: commitMessage,
        content: encoded ? fileContents : b64EncodeUnicode(fileContents),
        branch: branch,
        sha: sha || "",
      },
    });
  }

  async upload(
    path: string,
    fileContents: string,
    repo: string,
    branch: string,
    commitMessage: string = this.defaultCommitMessage,
    encoded: boolean = false
  ) {
    return this.githubFileApi(
      path,
      fileContents,
      commitMessage,
      encoded,
      "PUT",
      repo,
      branch
    );
  }

  async delete(
    path: string,
    commitMessage: string = `Deleted ${path} using TinaCMS`,
    repo: string,
    branch: string
  ) {
    try {
      return await this.githubFileApi(
        path,
        "",
        commitMessage,
        false,
        "DELETE",
        repo,
        branch
      );
    } catch (e) {}
  }

  protected async req(data: any) {
    const response = await this.proxyRequest(data);
    return this.getGithubResponse(response);
  }

  protected async getGithubResponse(response: Response) {
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

    const headers = { ...data.headers, authorization: `token ${token}` };
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
