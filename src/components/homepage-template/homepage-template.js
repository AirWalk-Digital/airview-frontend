import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { LocationProvider } from "../../hooks/use-location";
import { PageHeader } from "../page-header";
import { Main } from "../aside-and-main-container";

export function HomepageTemplate({
  currentRoute,
  siteTitle,
  pageTitle,
  version,
  logoSrc,
  navItems,
  loading,
}) {
  const ref = useRef(1);
  return (
    <React.Fragment>
      <LocationProvider location={currentRoute}>
        <Helmet>
          <title>{`${pageTitle} | ${siteTitle}`}</title>
        </Helmet>

        <PageHeader {...{ siteTitle, version, logoSrc, navItems, loading }} />
      </LocationProvider>
      <Main ref={ref}></Main>
    </React.Fragment>
  );
}

HomepageTemplate.propTypes = {
  /**
   * Used to set the required context for link active classes
   */
  currentRoute: PropTypes.string.isRequired,
  /**
   * Used to set the meta title in the document head and populate sub component data
   */
  siteTitle: PropTypes.string.isRequired,
  /**
   * Sets the meta title in the document head
   */
  pageTitle: PropTypes.string.isRequired,
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
  navItems: PropTypes.array,
};
