import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Skeleton from "@material-ui/lab/Skeleton";
import { Link } from "../link";

export function AccordionMenu({ menuTitle, navItems, loading, id, ...rest }) {
  const classes = useStyles();

  const [expanded, setExpanded] = useState([]);

  const handleOnExpandClick = (nodeId) => {
    if (expanded.includes(nodeId)) {
      setExpanded(expanded.filter((expandedId) => expandedId !== nodeId));
    } else {
      setExpanded([...expanded, nodeId]);
    }
  };

  const isNodeExpanded = (nodeId) => {
    return expanded.includes(nodeId);
  };

  const makeLoadingNavTree = () => {
    return [...Array(6)].map((item, index) => (
      <Skeleton key={index} className={classes.loadingNavItem} />
    ));
  };

  const makeNavTree = (nodes) => {
    return nodes?.map((node) => {
      if (node?.children) {
        return (
          <React.Fragment key={node.id}>
            <ListItem
              button
              disableRipple
              classes={{
                root: classes.menuItem,
                selected: classes.menuItemSelected,
                focusVisible: classes.menuItemFocusVisible,
              }}
              id={node.id}
              onClick={() => handleOnExpandClick(node.id)}
            >
              <ListItemText
                aria-label="Sub-menu"
                classes={{
                  root: classes.subMenuParentLabelRoot,
                  primary: classes.subMenuParentLabelPrimary,
                }}
              >
                {node.name}
              </ListItemText>
              {isNodeExpanded(node.id) ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={isNodeExpanded(node.id)} timeout="auto" unmountOnExit>
              <List
                component="div"
                dense
                classes={{ padding: classes.subMenuListPadding }}
              >
                {makeNavTree(node.children)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      } else {
        return (
          <ListItem
            classes={{
              root: classes.menuItem,
              focusVisible: classes.menuItemFocusVisible,
            }}
            component="div"
            key={node.id}
          >
            <ListItemText aria-label="Menu item label">
              <Link
                href={node.url}
                activeClassName={classes.activeLink}
                classNames={classes.menuItemLink}
              >
                {node.name}
              </Link>
            </ListItemText>
          </ListItem>
        );
      }
    });
  };

  return (
    <List
      component="nav"
      aria-labelledby={`${id}-list-subheader`}
      dense
      subheader={
        menuTitle && (
          <ListSubheader
            component="span"
            disableSticky
            id={`${id}-list-subheader`}
          >
            {menuTitle}
          </ListSubheader>
        )
      }
      {...rest}
    >
      {loading ? makeLoadingNavTree() : makeNavTree(navItems)}
    </List>
  );
}

AccordionMenu.propTypes = {
  /**
   * Sets a title for the AccordionMenu component
   */
  menuTitle: PropTypes.string,
  /**
   * Presents the menu in a lodaing state (for when fetching data async)
   */
  loading: PropTypes.bool,
  /**
   * Defines the menu structure
   */
  navItems: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        url: PropTypes.string,
      })
    ),
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        children: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            url: PropTypes.string,
            children: PropTypes.array,
          })
        ),
      })
    ),
  ]),
  /**
   * A unique ID required for accessibility requirements
   */
  id: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  // Loading nav item
  loadingNavItem: {
    margin: theme.spacing(1, 2),
  },

  // Menu Item
  menuItem: {
    "&$menuItemSelected": {
      background: "none",
    },
    "&$menuItemSelected:hover, &:hover, &:focus": {
      background: "none",
    },
    "&$menuItemFocusVisible": {
      color: "inherit",
    },
  },

  // Menu Item pseudo states
  menuItemSelected: {},

  activeLink: {
    "$menuItem &": {
      color: theme.palette.primary.main,
    },
  },

  menuItemFocusVisible: {},

  // Menu Item link
  menuItemLink: {
    textDecoration: "none",
    color: "inherit",
    outline: "none",
    transition: theme.transitions.create("color"),

    "$menuItemSelected &:hover": {
      cursor: "default",
    },

    "&:hover, &:focus": {
      color: theme.palette.primary.main,
    },
  },

  // Sub menu parent label
  subMenuParentLabelRoot: {
    marginRight: theme.spacing(1),
  },

  subMenuParentLabelPrimary: {
    fontWeight: theme.typography.fontWeightBold,
  },

  // Sub menu list
  subMenuListPadding: {
    padding: theme.spacing(0, 0, 0, 2),
  },
}));
