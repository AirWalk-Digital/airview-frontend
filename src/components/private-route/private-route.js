import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "oidc-react";
import { Route } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
  const auth = useAuth();

  return <Route {...rest}>{auth.userData && children}</Route>;
}

PrivateRoute.propTypes = {
  children: PropTypes.any,
};

export { PrivateRoute };
