import React from "react";
import { useAuth } from "oidc-react";
import { Route } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
  const auth = useAuth();

  return <Route {...rest}>{auth.userData && children}</Route>;
}

export { PrivateRoute };
