import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import { AccordionMenu } from "../accordion-menu";
import { pageHeaderStyles } from "./page-header.styles";
import { Link } from "react-router-dom";
import { Search } from "../search";

const useStyles = makeStyles((theme) => {
  return pageHeaderStyles(theme);
});

export function PageHeader({
  siteTitle,
  version,
  logoSrc,
  navItems,
  loading,
  onQueryChange,
  previewMode,
}) {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchOpenRef = useRef();
  const loadingRef = useRef();
  const previewModeRef = useRef();

  useEffect(() => {
    searchOpenRef.current = searchOpen;
    loadingRef.current = loading;
    previewModeRef.current = previewMode;
  });

  useEffect(() => {
    const handleOnKeyPress = (event) => {
      if (
        event.key === "/" &&
        !searchOpenRef.current &&
        !loadingRef.current &&
        !previewModeRef.current
      ) {
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleOnKeyPress);

    return () => window.removeEventListener("keydown", handleOnKeyPress);
  }, []);

  useEffect(() => {
    if (loading || (previewMode && searchOpen)) {
      setSearchOpen(false);
    }
  }, [loading, previewMode, searchOpen]);

  return (
    <header className={classes.root}>
      <AppBar>
        <Toolbar>
          <div className={classes.toolBarContainerLeft}>
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

          <div className={classes.toolBarContainerRight}>
            <button
              className={classes.invokeSearchBtn}
              onClick={() => setSearchOpen(true)}
              disabled={loading || previewMode || searchOpen}
            >
              <SearchIcon
                fontSize="small"
                color="primary"
                className={classes.invokeSearchIcon}
              />
              Search site&hellip;
              <span className={classes.invokeSearchShortcut}>&#47;</span>
            </button>
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
          className={classes.accordionMenu}
          menuTitle="Main Navigation"
          id="main-header-navigation"
          {...{ navItems }}
        />
      </Drawer>
      <div className={classes.offset} />
      <Search
        open={searchOpen}
        onQueryChange={onQueryChange}
        onRequestToClose={() => setSearchOpen(false)}
      />
    </header>
  );
}

PageHeader.propTypes = {
  /**
   * Presents the component in a loading state (for when fetching data async)
   */
  loading: PropTypes.bool.isRequired,
  /**
   * Sets the state of the preview mode
   */
  previewMode: PropTypes.bool.isRequired,
  /**
   * Sets the site title in the off canvas draw
   */
  siteTitle: PropTypes.string.isRequired,
  /**
   * Sets the version number in the off canvas draw
   */
  version: PropTypes.string.isRequired,
  /**
   * Sets the src of the header logo
   */
  logoSrc: PropTypes.string.isRequired,
  /**
   * Defines the menu structure of mainNavigation within side Drawer, (see [AccordionMenu](/?path=/docs/modules-accordion-menu--default) API for schema)
   */
  navItems: PropTypes.array.isRequired,
  /**
   * Callback fired when the user has changed the query input value of the search UI. see [Search](/?path=/docs/modules-search--single-result-found) `onQueryChange` API for details
   */
  onQueryChange: PropTypes.func.isRequired,
};
