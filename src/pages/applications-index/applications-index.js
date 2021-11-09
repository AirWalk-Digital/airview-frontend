import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ApplicationsIndexTemplate } from "../../components/applications-index-template";
import siteConfig from "../../site-config.json";
import { useNav } from "../../hooks/use-nav";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { useApiService } from "../../hooks/use-api-service/use-api-service";

export function ApplicationsIndex({
  currentRoute,
  pageTitle,
  breadcrumbLinks,
}) {
  const navItems = useNav();
  const apiService = useApiService();

  const isMounted = useIsMounted();

  const {
    siteTitle,
    version,
    theme: { logoSrc },
  } = siteConfig;

  const [applications, setApplications] = useState();

  const [loading, setLoading] = useState(true);

  const progressBarColorResolver = (value) => {
    if (value >= 80) return "#4caf50";
    if (value <= 20) return "#f44336";
    return "#002b3d";
  };

  const permissionsInvalidMessage =
    "You do not have the required permissions to view the data for this application";

  const noDataMessage = "There is no data to display for this application";

  useEffect(() => {
    if (!isMounted) return;

    const getApplicationsData = async () => {
      setLoading(true);

      let complianceData = undefined;
      try {
        const complianceResp = await apiService("/api/application-statuses/");
        complianceData = JSON.parse(await complianceResp.data.text());
      } catch (err) {
        // handle for user not having permission to get compliance info. We need to stitch together with app list even if they lack perms
        if (err.status !== 403) throw err;
      }

      const appResp = await apiService("/api/applications/");
      const apps = JSON.parse(await appResp.data.text())
        .map((m) => {
          // app needs mapping to template data. Build slug from _internal_reference
          const app = {
            applicationName: m.name,
            id: m.id,
            url: `/applications/${
              m.references.find((f) => f.type === "_internal_reference")
                .reference
            }`,
          };
          // if undefined this must have been a 403 failure when getting data.
          /// Return without environments set, component will render undefined as permissionsInvalidMessage
          if (complianceData === undefined) return app;

          // set the environments for the app, default to [] for noDataMessage
          app.environments = (
            complianceData.find((f) => f.id === m.id)?.environments || []
          ).map((e) => ({
            ...e,
            environment: e.environment || "n/a",
            overviewValue: (1 - e.failedControls / e.totalControls) * 100,
          }));

          return app;
        })
        .sort((a, b) => a.applicationName.localeCompare(b.applicationName));

      setApplications(apps);

      setLoading(false);
    };

    getApplicationsData();
  }, [isMounted, navItems]);

  return (
    <ApplicationsIndexTemplate
      {...{
        currentRoute,
        pageTitle,
        siteTitle,
        version,
        logoSrc,
        navItems,
        breadcrumbLinks,
        progressBarColorResolver,
        permissionsInvalidMessage,
        noDataMessage,
        applications,
        loading,
      }}
    />
  );
}

ApplicationsIndex.propTypes = {
  currentRoute: PropTypes.string,
  pageTitle: PropTypes.string,
  breadcrumbLinks: PropTypes.array,
};
