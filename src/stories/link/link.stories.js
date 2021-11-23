import React from "react";
import { LocationProvider } from "../../hooks/use-location";
import { Link } from "../../components/link";

const config = {
  title: "Modules/Link",
  component: Link,
  decorators: [
    (story) => {
      return <LocationProvider location="/">{story()}</LocationProvider>;
    },
  ],
  argTypes: {
    children: {
      control: {
        type: "text",
      },
    },
  },
};

function Template(args) {
  return <Link {...args} />;
}

Template.args = {
  children: "Link Label",
  activeClassName: "test-active-classname",
};

const MuiStyledInternalLink = Template.bind({});

MuiStyledInternalLink.args = {
  ...Template.args,
  href: "/some-internal-link",
  noLinkStyle: false,
};

const NonMuiStyledInternalLink = Template.bind({});

NonMuiStyledInternalLink.args = {
  ...Template.args,
  href: "/some-internal-link",
  noLinkStyle: true,
};

const ActiveInternalLink = Template.bind({});

ActiveInternalLink.args = {
  ...Template.args,
  href: "/",
  noLinkStyle: false,
};

const MuiStyledExternalLink = Template.bind({});

MuiStyledExternalLink.args = {
  ...Template.args,
  href: "https://google.co.uk",
  noLinkStyle: false,
};

const NonMuiStyledExternalLink = Template.bind({});

NonMuiStyledExternalLink.args = {
  ...Template.args,
  href: "https://google.co.uk",
  noLinkStyle: true,
};

export default config;
export {
  MuiStyledInternalLink,
  NonMuiStyledInternalLink,
  ActiveInternalLink,
  MuiStyledExternalLink,
  NonMuiStyledExternalLink,
};
