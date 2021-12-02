import React from "react";
import { Breadcrumb } from "../../components/breadcrumb";
import { LocationProvider } from "../../hooks/use-location";

export default {
  title: "Modules/Breadcrumb",
  component: Breadcrumb,
};

function Template(args) {
  return (
    <LocationProvider location="/">
      <Breadcrumb {...args} />
    </LocationProvider>
  );
}

Template.args = {
  activeRoute: "Current Route",
  maxItems: 5,
};

export const Loading = {
  ...Template,
  args: {
    ...Template.args,
    loading: true,
    links: [],
  },
};

export const LoadedWithoutCollapsedBreadcrumbs = {
  ...Template,
  args: {
    ...Template.args,
    loading: false,
    links: [
      {
        label: "Route One",
        url: "/",
      },
      {
        label: "Route Two",
        url: "/",
      },
      {
        label: "Route Three",
        url: "/",
      },
      {
        label: "Route Four",
        url: "/",
      },
    ],
  },
};

export const LoadedWithCollapsedBreadcrumbs = {
  ...LoadedWithoutCollapsedBreadcrumbs,
  args: {
    ...LoadedWithoutCollapsedBreadcrumbs.args,
    links: [
      ...LoadedWithoutCollapsedBreadcrumbs.args.links,
      {
        label: "Route Five",
        url: "/",
      },
    ],
  },
};
