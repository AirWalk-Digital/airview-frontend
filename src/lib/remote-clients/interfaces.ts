export type AuthScope = "public_repo" | "repo";
export interface GithubClientOptions {
  proxy: string;
  clientId: string;
  authCallbackRoute: string;
  baseRepoFullName: string;
  baseBranch?: string;
  authScope?: AuthScope;
  redirect_uri: string;
  defaultCommitMessage?: string;
}

export interface Branch {
  name: string;
  protected: boolean;
}
