import React from "react";
import { useLocation } from "react-router-dom";
import { ApplicationsIndex } from "../applications-index";

export function ApplicationsIndexPage() {
  const breadcrumbLinks = [
    {
      label: "Home",
      url: "/",
    },
  ];

  const pageTitle = "Applications";

  const { pathname: currentRoute } = useLocation();

  return (
    <ApplicationsIndex {...{ currentRoute, pageTitle, breadcrumbLinks }} />
  );
}
