import React from "react";
import PropTypes from "prop-types";
import { HashLink } from "react-router-hash-link";
import { Link as MuiLink } from "@material-ui/core";
import clsx from "clsx";
import { useLocation } from "../../hooks/use-location";

export const Link = React.forwardRef((props, ref) => {
  const {
    href,
    noLinkStyle = false,
    className,
    activeClassName,
    linkProps,
    children,
  } = props;

  const location = useLocation();

  const isExternal =
    typeof href === "string" &&
    (href.indexOf("http") === 0 ||
      href.indexOf("mailto:") === 0 ||
      href.indexOf("tel:") === 0);

  if (isExternal) {
    if (noLinkStyle) {
      return (
        <a
          href={href}
          rel="noreferrer"
          target="_blank"
          className={className}
          {...linkProps}
        >
          {children}
        </a>
      );
    }

    return (
      <MuiLink
        href={href}
        rel="noreferrer"
        target="_blank"
        className={className}
        {...linkProps}
      >
        {children}
      </MuiLink>
    );
  }

  const classes = clsx(className, href === location ? activeClassName : null);

  if (noLinkStyle) {
    return (
      <HashLink to={href} className={classes} smooth>
        {children}
      </HashLink>
    );
  }

  return (
    <MuiLink
      component={HashLink}
      to={href}
      className={classes}
      {...linkProps}
      smooth
    >
      {children}
    </MuiLink>
  );
});

Link.propTypes = {
  /**
   * Sets the href for the link
   */
  href: PropTypes.string.isRequired,
  /**
   * Renders the link with no styles
   */
  noLinkStyle: PropTypes.bool,
  /**
   * Applies classnames to the element
   */
  classNames: PropTypes.string,
  /**
   * Applies an active classname to the Link (if required)
   */
  activeClassName: PropTypes.string,
  /**
   * Applies any required Mui Link component props
   */
  linkProps: PropTypes.object,
  /**
   * Used to set the inner content of the link
   */
  children: PropTypes.node.isRequired,
};
