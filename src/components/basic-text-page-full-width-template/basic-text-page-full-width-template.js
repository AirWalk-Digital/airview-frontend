import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Grid } from "@material-ui/core";
import { LocationProvider } from "../../hooks/use-location";
import { PageHeader } from "../page-header";
import { MarkdownContent } from "../markdown-content";
import { Breadcrumb } from "../breadcrumb";

function BasicTextPageFullWidthTemplate({
  currentRoute,
  siteTitle,
  pageTitle,
  version,
  logoSrc,
  navItems,
  loading,
  breadcrumbLinks,
  bodyContent,
  onQueryChange,
}) {
  const styles = useStyles();

  return (
    <React.Fragment>
      <LocationProvider location={currentRoute}>
        <Helmet>
          <title>{`${pageTitle} | ${siteTitle}`}</title>
        </Helmet>

        <PageHeader
          previewMode={false}
          {...{ siteTitle, version, logoSrc, navItems, loading, onQueryChange }}
        />

        <Container>
          <Breadcrumb
            links={breadcrumbLinks}
            loading={loading}
            activeRoute={pageTitle}
            classNames={styles.breadcrumb}
          />
        </Container>

        <Container className={styles.mainContainer}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <article>
                {!loading && (
                  <Typography variant="h1" paragraph>
                    {pageTitle}
                  </Typography>
                )}
                <MarkdownContent
                  readOnly={true}
                  defaultValue={bodyContent}
                  loading={loading}
                />
              </article>
            </Grid>
          </Grid>
        </Container>
      </LocationProvider>
    </React.Fragment>
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

BasicTextPageFullWidthTemplate.propTypes = {
  /**
   * Used to set the required context for link active classes
   */
  currentRoute: PropTypes.string,
  /**
   * Used to set the meta title in the document head and populate sub component data
   */
  siteTitle: PropTypes.string,
  /**
   * Sets the meta title in the document head
   */
  pageTitle: PropTypes.string,
  /**
   * Used to set the version number in the main header menu
   */
  version: PropTypes.string,
  /**
   * Used to render the logo in the main header
   */
  logoSrc: PropTypes.string,
  /**
   * Used to render the main navigation in the main header (see [AccordionMenu](/?path=/docs/modules-accordion-menu) `navItems` prop API for schema)
   */
  navItems: PropTypes.array,
  /**
   * Used to set the breadcrumb navigation (see [Breadcumb](/?path=/docs/modules-breadcrumb) `links` prop API for schema
   */
  breadcrumbLinks: PropTypes.array,
  /**
   * Used to set the main page content, pass a string of Markdown
   */
  bodyContent: PropTypes.string,
  /**
   * Used to indicate to the user that the page content is loading (for when fetching data async)
   */
  loading: PropTypes.bool,
  /**
   * Callback fired when the user has changed the query input value of the search UI. see [Search](/?path=/docs/modules-search--single-result-found) `onQueryChange` API for details
   */
  onQueryChange: PropTypes.func,
};

export { BasicTextPageFullWidthTemplate };
