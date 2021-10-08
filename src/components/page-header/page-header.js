import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
//import SearchIcon from "@material-ui/icons/Search";
//import InputBase from "@material-ui/core/InputBase";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import { AccordionMenu } from "../accordion-menu";
import { pageHeaderStyles } from "./page-header.styles";
import cn from "classnames";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => {
  return pageHeaderStyles(theme);
});

export function PageHeader({
  siteTitle,
  version,
  logoSrc,
  navItems,
  loading,
  testid,
}) {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className={classes.root} data-testid={testid}>
      <AppBar>
        <Toolbar>
          <div className={cn(classes.toolBarContainerLeft)}>
            <IconButton
              className={classes.revealMenuButton}
              edge="start"
              color="inherit"
              aria-label="Show navigation menu"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <MenuIcon />
            </IconButton>

            <Link to="/" className={classes.toolbarLogo}>
              <img src={logoSrc} alt={siteTitle} />
            </Link>
          </div>

          <div className={cn(classes.toolBarContainerRight)}>
            {/*
            <div className={classes.toolbarSearch}>
              <SearchIcon />
              <InputBase
                placeholder="Search..."
                classes={{
                  root: classes.toolbarSearchInputRoot,
                  input: classes.toolbarSearchInput,
                }}
                inputProps={{ "aria-label": "Search site" }}
              />
            </div>
            */}

            <div className={classes.toolbarActions}></div>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div className={classes.drawerTitle}>
          <Typography variant="h6">{siteTitle}</Typography>
          <Typography className={classes.version}>v{version}</Typography>
        </div>

        <AccordionMenu
          loading={loading}
          classNames={classes.accordionMenu}
          menuTitle="Main Navigation"
          {...{ navItems }}
        />
      </Drawer>
      <div className={classes.offset} />
    </header>
  );
}

PageHeader.propTypes = {
  /**
   * Presents the component in a loading state (for when fetching data async)
   */
  loading: PropTypes.bool,
  /**
   * Sets the site title in the off canvas draw
   */
  siteTitle: PropTypes.string,
  /**
   * Sets the version number in the off canvas draw
   */
  version: PropTypes.string,
  /**
   * Sets the src of the header logo, if not set no logo will render
   */
  logoSrc: PropTypes.string,
  /**
   * Defines the menu structure of mainNavigation within side Drawer, (see [AccordionMenu](/?path=/docs/modules-accordion-menu--default) API for schema)
   */
  navItems: PropTypes.array,
  /**
   * Sets a test id on the parent node of the component, for testing purposes
   */
  testid: PropTypes.string,
};
