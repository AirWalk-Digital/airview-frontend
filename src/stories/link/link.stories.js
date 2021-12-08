import React from "react";
import { LocationProvider } from "../../hooks/use-location";
import { Link } from "../../components/link";

export default {
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

export const InternalLinkNonActiveMuiStyled = {
  ...Template,
  args: {
    ...Template.args,
    href: "/some-internal-link",
    noLinkStyle: false,
  },
};

export const InternalLinkNonActiveNonMuiStyled = {
  ...Template,
  args: {
    ...Template.args,
    href: "/some-internal-link",
    noLinkStyle: true,
  },
};

export const InternalLinkActiveMuiStyled = {
  ...Template,
  args: {
    ...Template.args,
    href: "/",
    noLinkStyle: false,
  },
};

export const InternalLinkActiveNonMuiStyled = {
  ...Template,
  args: {
    ...Template.args,
    href: "/",
    noLinkStyle: true,
  },
};

export const ExternalLinkMuiStyled = {
  ...Template,
  args: {
    ...Template.args,
    href: "https://google.co.uk",
    noLinkStyle: false,
  },
};

export const ExternalLinkNonMuiStyled = {
  ...Template,
  args: {
    ...Template.args,
    href: "https://google.co.uk",
    noLinkStyle: true,
  },
};
