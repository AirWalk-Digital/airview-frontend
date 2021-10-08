import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "../../components/link";

const config = {
  title: "Modules/Link",
  component: Link,
};

function Default(args) {
  const styles = useStyles();
  return <Link {...args} activeClassName={styles.currentLink} />;
}

Default.argTypes = {
  classNames: {
    control: false,
  },
  activeClassName: {
    control: false,
  },
};

Default.args = {
  href: "/",
  linkProps: {},
  children: "Link Label",
};

const useStyles = makeStyles((theme) => ({
  currentLink: {
    color: "red",
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default config;
export { Default };
