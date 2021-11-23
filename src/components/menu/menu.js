import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { Link } from "../link";

function Menu({
  menuTitle,
  menuTitleElement = "h6",
  loading,
  menuItems,
  collapsible = true,
  initialCollapsed = false,
  classNames,
}) {
  const classes = useCollapsibleMenuStyles();

  const [collapsed, setCollapsed] = useState(
    collapsible ? initialCollapsed : false
  );

  return (
    <nav className={classNames}>
      <header className={classes.menuHeader}>
        <Typography component={menuTitleElement} className={classes.menuTitle}>
          {loading ? <Skeleton width="90%" /> : menuTitle}
        </Typography>

        {collapsible && (
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            size="medium"
            classes={{ root: classes.menuCollapseIconButton }}
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          >
            {collapsed ? (
              <ExpandMore fontSize="inherit" />
            ) : (
              <ExpandLess fontSize="inherit" />
            )}
          </IconButton>
        )}
      </header>

      <Collapse in={!collapsed}>
        <ul className={classes.menuListContainer} aria-hidden={collapsed}>
          {loading
            ? [...Array(6)].map((item, index) => (
                <Skeleton
                  key={index}
                  component="li"
                  className={classes.menuItem}
                />
              ))
            : menuItems?.map(({ label, url }, index) => {
                return (
                  <li className={classes.menuItem} key={index}>
                    <Link
                      href={url}
                      className={classes.menuLink}
                      activeClassName={classes.currentMenuItem}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
        </ul>
      </Collapse>
    </nav>
  );
}

Menu.propTypes = {
  /**
   * Presents the component in a lodaing state (for when fetching data async)
   */
  loading: PropTypes.bool,
  /**
   * An optional title for the menu (required if collapsible is true)
   */
  menuTitle: PropTypes.string,
  /**
   * The required semantic HTML tag for the menu title
   */
  menuTitleElement: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
  /**
   * The menu link items to be rendered
   */
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  /**
   * Determines if the menu should have collapsible functionality
   */
  collapsible: PropTypes.bool,
  /**
   * Sets the initial collapsed state of the menu
   */
  initialCollapsed: PropTypes.bool,
  /**
   * Optional CSS classname to apply styles to the parent `Menu` container
   */
  classNames: PropTypes.string,
};

const useCollapsibleMenuStyles = makeStyles((theme) => {
  return {
    menuHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 0,
    },
    menuTitle: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightMedium,
      display: "block",
      flex: "1 1 auto",
    },
    menuCollapseIconButton: {
      marginLeft: theme.spacing(1),
      padding: 0,
      color: theme.palette.text.primary,
    },
    menuListContainer: {
      margin: theme.spacing(2, 0, 0, 0),
      padding: 0,
      listStyle: "none",
    },
    menuItem: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightRegular,
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(1),
    },
    currentMenuItem: {
      color: theme.palette.primary.main,
    },
    menuLink: {
      "&, &:visited, &:hover, &:focus, &:active": {
        color: "inherit",
        textDecoration: "none",
        outline: "none",
      },
      "&:hover, &:focus": {
        textDecoration: "underline",
      },
    },
  };
});

export { Menu };
