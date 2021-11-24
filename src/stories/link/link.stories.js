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

const InternalLinkNonActiveMuiStyled = Template.bind({});

InternalLinkNonActiveMuiStyled.args = {
  ...Template.args,
  href: "/some-internal-link",
  noLinkStyle: false,
};

const InternalLinkNonActiveNonMuiStyled = Template.bind({});

InternalLinkNonActiveNonMuiStyled.args = {
  ...Template.args,
  href: "/some-internal-link",
  noLinkStyle: true,
};

const InternalLinkActiveMuiStyled = Template.bind({});

InternalLinkActiveMuiStyled.args = {
  ...Template.args,
  href: "/",
  noLinkStyle: false,
};

const InternalLinkActiveNonMuiStyled = Template.bind({});

InternalLinkActiveNonMuiStyled.args = {
  ...Template.args,
  href: "/",
  noLinkStyle: true,
};

const ExternalLinkMuiStyled = Template.bind({});

ExternalLinkMuiStyled.args = {
  ...Template.args,
  href: "https://google.co.uk",
  noLinkStyle: false,
};

const ExternalLinkNonMuiStyled = Template.bind({});

ExternalLinkNonMuiStyled.args = {
  ...Template.args,
  href: "https://google.co.uk",
  noLinkStyle: true,
};

export default config;
export {
  InternalLinkNonActiveMuiStyled,
  InternalLinkNonActiveNonMuiStyled,
  InternalLinkActiveMuiStyled,
  InternalLinkActiveNonMuiStyled,
  ExternalLinkMuiStyled,
  ExternalLinkNonMuiStyled,
};
