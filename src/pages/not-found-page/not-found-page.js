import React from "react";
import { useLocation } from "react-router-dom";
import siteConfig from "../../site-config.json";
import { useNav } from "../../hooks/use-nav";
import { useSearch } from "../../hooks/use-search";
import { TextPageTemplate } from "../../components/text-page-template";

export function NotFoundPage() {
  const location = useLocation();
  const requestedUrl = location.state?.location.pathname ?? location.pathname;
  const onQueryChange = useSearch();

  return (
    <TextPageTemplate
      currentRoute="/not-found"
      pageTitle="Page Not Found"
      siteTitle={siteConfig.siteTitle}
      version={siteConfig.version}
      logoSrc={siteConfig.theme.logoSrc}
      navItems={useNav()}
      breadcrumbLinks={[
        {
          label: "Home",
          url: "/",
        },
      ]}
      mainContentProps={{
        content: [
          {
            defaultValue: `The requested page at path *${requestedUrl}* was not found. Please check you have requested the correct URL. **If you were editing un-published content then this message is expected until the content is published**. Click [here](/) to head back to the homepage.`,
          },
        ],
      }}
      loading={false}
      onQueryChange={onQueryChange}
    />
  );
}
