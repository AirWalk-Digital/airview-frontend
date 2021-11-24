import React from "react";
import { Breadcrumb } from "../../components/breadcrumb";
import { LocationProvider } from "../../hooks/use-location";

const config = {
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
  activeRoute: "Activity Feed Guide",
  maxItems: 5,
};

const LoadingWithoutCollapsedBreadcrumbs = Template.bind({});

LoadingWithoutCollapsedBreadcrumbs.args = {
  ...Template.args,
  loading: true,
  links: [],
};

const LoadingWithCollapsedBreadcrumbs = Template.bind({});

LoadingWithCollapsedBreadcrumbs.args = {
  ...Template.args,
  loading: true,
  maxItems: 4,
};

const LoadedWithoutCollapsedBreadcrumbs = Template.bind({});

LoadedWithoutCollapsedBreadcrumbs.args = {
  ...Template.args,
  loading: false,
  links: [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Applications",
      url: "/applications",
    },
    {
      label: "Microsoft Teams",
      url: "/applications/microsoft_teams",
    },
    {
      label: "Knowledge",
      url: "/applications/microsoft_teams/knowledge",
    },
  ],
};

const LoadedWithCollapsedBreadcrumbs = Template.bind({});

LoadedWithCollapsedBreadcrumbs.args = {
  ...LoadedWithoutCollapsedBreadcrumbs.args,
  maxItems: LoadedWithoutCollapsedBreadcrumbs.args.links.length,
};

export default config;
export {
  LoadingWithoutCollapsedBreadcrumbs,
  LoadingWithCollapsedBreadcrumbs,
  LoadedWithoutCollapsedBreadcrumbs,
  LoadedWithCollapsedBreadcrumbs,
};
