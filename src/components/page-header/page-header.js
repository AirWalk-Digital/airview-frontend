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
  testid,
  onQueryChange,
}) {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchOpenRef = useRef();
  const loadingRef = useRef();

  const handleOnInvokeSearchClick = () => {
    if (searchOpen || loading) return;

    setSearchOpen(true);
  };

  useEffect(() => {
    searchOpenRef.current = searchOpen;
    loadingRef.current = loading;
  });

  useEffect(() => {
    const handleOnKeyPress = (event) => {
      if (
        event.key === "k" &&
        event.metaKey &&
        !searchOpenRef.current &&
        !loadingRef.current
      ) {
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleOnKeyPress);

    return () => window.removeEventListener("keydown", handleOnKeyPress);
  }, []);

  return (
    <header className={classes.root} data-testid={testid}>
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
              onClick={handleOnInvokeSearchClick}
              disabled={searchOpen || loading}
            >
              <SearchIcon
                fontSize="small"
                color="primary"
                className={classes.invokeSearchIcon}
              />
              Search site&hellip;
              <span className={classes.invokeSearchShortcut}>&#8984;K</span>
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
          classNames={classes.accordionMenu}
          menuTitle="Main Navigation"
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
  /**
   * Callback fired when the user has changed the query input value of the search UI. see [Search](/?path=/docs/modules-search--single-result-found) `onQueryChange` API for details
   */
  onQueryChange: PropTypes.func,
};
