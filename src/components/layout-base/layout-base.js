import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { PageHeader } from "../page-header";
import { Breadcrumb } from "../breadcrumb";
import { LocationProvider } from "../../hooks/use-location";

export function LayoutBase({
  currentRoute,
  pageTitle,
  siteTitle,
  version,
  logoSrc,
  navItems,
  loading,
  onQueryChange,
  previewMode,
  breadcrumbLinks,
  children,
}) {
  const styles = useStyles();

  return (
    <LocationProvider location={currentRoute}>
      <Helmet>
        <title>{`${pageTitle} | ${siteTitle}`}</title>
      </Helmet>

      <PageHeader
        {...{
          siteTitle,
          version,
          logoSrc,
          navItems,
          loading,
          onQueryChange,
          previewMode,
        }}
      />

      <Container>
        <Breadcrumb
          links={breadcrumbLinks}
          loading={loading}
          activeRoute={pageTitle}
          className={styles.breadcrumb}
        />
      </Container>

      <div className={styles.mainContainer}>{children}</div>
    </LocationProvider>
  );
}

const useStyles = makeStyles((theme) => {
  return {
    breadcrumb: {
      paddingTop: theme.spacing(6),
    },
    mainContainer: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(8),
    },
  };
});

LayoutBase.propTypes = {
  /**
   * Used to set the required context for link active classes
   */
  currentRoute: PropTypes.string.isRequired,
  /**
   * Sets the meta title in the document head
   */
  pageTitle: PropTypes.string.isRequired,
  /**
   * Used to set the meta title in the document head and populate sub component data
   */
  siteTitle: PropTypes.string.isRequired,
  /**
   * Used to set the version number in the main header menu
   */
  version: PropTypes.string.isRequired,
  /**
   * Used to render the logo in the main header
   */
  logoSrc: PropTypes.string.isRequired,
  /**
   * Used to render the main navigation in the main header (see [AccordionMenu](/?path=/docs/modules-accordion-menu) `navItems` prop API for schema)
   */
  navItems: PropTypes.array.isRequired,
  /**
   * Presents the component in a loading state (for when fetching data async)
   */
  loading: PropTypes.bool.isRequired,
  /**
   * Callback fired when the user has changed the query input value of the search UI. see [Search](/?path=/docs/modules-search--single-result-found) `onQueryChange` API for details
   */
  onQueryChange: PropTypes.func.isRequired,
  /**
   * Used to render or hide the content edit button
   */
  previewMode: PropTypes.bool.isRequired,
  /**
   * Used to set the breadcrumb navigation (see [Breadcumb](/?path=/docs/modules-breadcrumb) `links` prop API for schema
   */
  breadcrumbLinks: PropTypes.array.isRequired,
  /**
   * Content to be pased to the main page section
   */
  children: PropTypes.node,
};
