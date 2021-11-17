import React from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "../../hooks/use-search";
import { ApplicationsIndex } from "../applications-index";

export function HomePage() {
  const breadcrumbLinks = [];

  const pageTitle = "Home";

  const { pathname: currentRoute } = useLocation();

  const onQueryChange = useSearch();

  return (
    <ApplicationsIndex
      {...{ currentRoute, pageTitle, breadcrumbLinks, onQueryChange }}
    />
  );
}
