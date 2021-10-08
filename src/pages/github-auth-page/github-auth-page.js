import React from "react";
import { useGithubAuthRedirect } from "../../lib/remote-clients";

export function GithubAuthPage() {
  useGithubAuthRedirect();

  return <span>Authorizing github</span>;
}
