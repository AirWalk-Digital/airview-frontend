import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { Container, Grid, Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import WarningIcon from "@material-ui/icons/Warning";
import { Helmet } from "react-helmet";
import { PageHeader } from "../page-header";
import { Breadcrumb } from "../breadcrumb";
import { LocationProvider } from "../../hooks/use-location";
import {
  ApplicationTile,
  ApplicationTileHeader,
  ApplicationTileTitle,
  ApplicationTileDivider,
  ApplicationTileContent,
  ApplicationTileContentRow,
  ApplicationTileCallToActionButton,
  ApplicationTileChip,
} from "../application-tile";
import { ProgressBar } from "../../components/progress-bar";

export function ApplicationsIndexTemplate({
  currentRoute,
  pageTitle,
  siteTitle,
  version,
  logoSrc,
  navItems,
  breadcrumbLinks,
  applications,
  permissionsInvalidMessage,
  noDataMessage,
  progressBarColorResolver,
  loading,
  onQueryChange,
}) {
  const styles = useStyles();
  const theme = useTheme();

  const renderEnvironments = (environments) => {
    const renderIconChips = (chipValues) => {
      return (
        <React.Fragment>
          <ApplicationTileChip
            tooltipLabel="Low Impact Resources"
            icon={<WarningIcon />}
            label={chipValues[0].toString()}
            color={theme.palette.success.main}
          />

          <ApplicationTileChip
            tooltipLabel="Medium Impact Resources"
            icon={<WarningIcon />}
            label={chipValues[1].toString()}
            color={theme.palette.warning.main}
          />

          <ApplicationTileChip
            tooltipLabel="High Impact Resources"
            icon={<WarningIcon />}
            label={chipValues[2].toString()}
            color={theme.palette.error.main}
          />

          <ApplicationTileChip
            tooltipLabel="Exempt Resources"
            icon={<WarningIcon />}
            label={chipValues[3].toString()}
            color={theme.palette.grey["800"]}
          />
        </React.Fragment>
      );
    };

    if (!environments || !environments.length) {
      return (
        <ApplicationTileContent>
          <ApplicationTileContentRow>
            <Typography align="center" variant="body2">
              {!environments ? permissionsInvalidMessage : noDataMessage}
            </Typography>
          </ApplicationTileContentRow>
        </ApplicationTileContent>
      );
    }

    if (environments.length === 1) {
      const environment = environments[0];

      return (
        <ApplicationTileContent>
          <ApplicationTileContentRow>
            <ApplicationTileTitle>
              {environment.environment}
            </ApplicationTileTitle>

            <ApplicationTileContentRow inlineContent>
              {renderIconChips([
                environment.low,
                environment.medium,
                environment.high,
                environment.exemptControls,
              ])}
            </ApplicationTileContentRow>

            <ProgressBar
              color={progressBarColorResolver(environment.overviewValue)}
              value={environment.overviewValue}
            />
          </ApplicationTileContentRow>
        </ApplicationTileContent>
      );
    }

    return (
      <React.Fragment>
        <ApplicationTileContent>
          <ApplicationTileContentRow>
            {environments.map((environmentData) => (
              <React.Fragment key={environmentData.environment}>
                <ApplicationTileTitle level="h3" size="small">
                  {environmentData.environment}
                </ApplicationTileTitle>

                <ProgressBar
                  color={progressBarColorResolver(
                    environmentData.overviewValue
                  )}
                  value={environmentData.overviewValue}
                />
              </React.Fragment>
            ))}
          </ApplicationTileContentRow>
        </ApplicationTileContent>

        <ApplicationTileDivider />

        <ApplicationTileContent collapsible initialCollapsed>
          {environments.map((environmentData) => (
            <ApplicationTile gutter key={environmentData.environment}>
              <ApplicationTileHeader
                dense
                leftContent={
                  <ApplicationTileTitle level="h4">
                    {environmentData.environment}
                  </ApplicationTileTitle>
                }
              />

              <ApplicationTileContent>
                <ApplicationTileContentRow inlineContent>
                  {renderIconChips([
                    environmentData.low,
                    environmentData.medium,
                    environmentData.high,
                    environmentData.exemptControls,
                  ])}
                </ApplicationTileContentRow>
              </ApplicationTileContent>
            </ApplicationTile>
          ))}
        </ApplicationTileContent>
      </React.Fragment>
    );
  };

  return (
    <LocationProvider location={currentRoute}>
      <Helmet>
        <title>{`${pageTitle} | ${siteTitle}`}</title>
      </Helmet>

      <PageHeader
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
            <Typography variant="h1" paragraph>
              {pageTitle}
            </Typography>
          </Grid>
        </Grid>

        {loading && (
          <Grid container spacing={4} className={styles.applicationsContainer}>
            {Array.from(new Array(18)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rect" width="100%" height={280} />
              </Grid>
            ))}
          </Grid>
        )}

        {applications && !loading && (
          <Grid container spacing={4} className={styles.applicationsContainer}>
            {applications.map((application) => (
              <Grid item xs={12} sm={6} md={4} key={application.id}>
                <ApplicationTile>
                  <ApplicationTileHeader
                    leftContent={
                      <ApplicationTileTitle>
                        {application.applicationName}
                      </ApplicationTileTitle>
                    }
                    rightContent={
                      <ApplicationTileCallToActionButton
                        href={application.url}
                        label="View"
                      />
                    }
                  />
                  {renderEnvironments(application.environments)}
                </ApplicationTile>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </LocationProvider>
  );
}

const useStyles = makeStyles((theme) => ({
  breadcrumb: {
    paddingTop: theme.spacing(6),
  },
  mainContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  applicationsContainer: {
    marginTop: theme.spacing(2),
  },
}));

ApplicationsIndexTemplate.propTypes = {
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
   * Used to set the breadcrumb navigation (see [Breadcumb](/?path=/docs/modules-breadcrumb) `links` prop API for schema
   */
  breadcrumbLinks: PropTypes.array.isRequired,
  /**
   * Used to render the applications grid **note:** `environments.overviewValue` is used to render the progress bar UI
   */
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      applicationName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      environments: PropTypes.arrayOf(
        PropTypes.shape({
          environment: PropTypes.string.isRequired,
          overviewValue: PropTypes.number.isRequired,
          low: PropTypes.number.isRequired,
          medium: PropTypes.number.isRequired,
          high: PropTypes.number.isRequired,
          exemptControls: PropTypes.number.isRequired,
        })
      ),
    })
  ),
  /**
   * Used to set the message that is shown to a user when they do not have required permissions to view application data
   */
  permissionsInvalidMessage: PropTypes.string.isRequired,
  /**
   * Used to set the message that is shown to a user when there is no data to display for a specific application
   */
  noDataMessage: PropTypes.string.isRequired,
  /**
   * Function used to provide a color for the environment progress bar, accepts a value as an argument and expects the return of a [valid CSS color value](https://www.w3schools.com/cssref/css_colors_legal.asp) **signature:** `(value: Int) => CSS color value : String`
   */
  progressBarColorResolver: PropTypes.func.isRequired,
  /**
   * Presents the template in a loading state (for when fetching data async)
   */
  loading: PropTypes.bool.isRequired,
  /**
   * Callback fired when the user has changed the query input value of the search UI. see [Search](/?path=/docs/modules-search--single-result-found) `onQueryChange` API for details
   */
  onQueryChange: PropTypes.func,
};
