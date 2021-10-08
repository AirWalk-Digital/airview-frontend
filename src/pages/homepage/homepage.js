import React from "react";
import { useLocation } from "react-router-dom";
import { ApplicationsIndex } from "../applications-index";

export function HomePage() {
  const breadcrumbLinks = [];

  const pageTitle = "Home";

  const { pathname: currentRoute } = useLocation();

  return (
    <ApplicationsIndex {...{ currentRoute, pageTitle, breadcrumbLinks }} />
  );
}
