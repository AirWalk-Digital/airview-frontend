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
  activeRoute: "Activity Feed Guide",
  maxItems: 5,
};

const Default = Template.bind({});

Default.args = {
  ...Template.args,
};

const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
  links: null,
  loading: true,
};

export default config;
export { Default, Loading };
