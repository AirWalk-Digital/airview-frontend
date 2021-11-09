import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Container, Typography } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { PageHeader } from "../page-header";
import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";
import {
  AsideAndMainContainer,
  Aside,
  Main,
} from "../aside-and-main-container";
import { MarkdownContent } from "../markdown-content";
import { ComplianceTable } from "../compliance-table";
import { ControlOverview } from "../control-overview";
import {
  PreviewModeController,
  BranchSwitcher,
  BranchCreator,
  KnowledgePageCreator,
  ContentCommitter,
  ApplicationCreator,
  PullRequestCreator,
} from "../preview-mode-controller";
import { LocationProvider } from "../../hooks/use-location";

export function ApplicationsTemplate({
  loading,
  previewMode,
  currentRoute,
  siteTitle,
  pageTitle,
  version,
  logoSrc,
  navItems,
  breadcrumbLinks,
  bodyContent,
  knowledgeLinks,
  complianceTableTitle,
  complianceTableApplications,
  complianceTableOnAcceptOfRisk,
  complianceTableInvalidPermissionsMessage,
  complianceTableNoDataMessage,
  workingRepo,
  workingBranch,
  baseBranch,
  branches,
  applicationTypes,
  applications,
  environments,
  referenceTypes,
  onRequestToCreateApplication,
  onTogglePreviewMode,
  onRequestToSwitchBranch,
  onRequestToCreateBranch,
  onRequestToCreatePage,
  onRequestToCreatePullRequest,
  onRequestToUploadImage,
  onSave,
  controlOverviewTitle,
  controlOverviewData,
  onRequestOfControlsData,
  onRequestOfResourcesData,
  onResourceExemptionDelete,
  onResourceExemptionSave,
}) {
  const styles = useStyles();
  const [canSave, setCanSave] = useState(false);
  const [tocData, setTocData] = useState([]);
  const editorRef = useRef();
  const edits = useRef();

  useEffect(() => {
    const headings = editorRef.current?.getHeadings();

    if (headings) {
      setTocData(
        headings.map((heading) => ({
          label: heading.title,
          url: `#${heading.id}`,
        }))
      );
    }

    setCanSave(false);
  }, [bodyContent]);

  const handleOnEdit = (data) => {
    if (bodyContent.trim() === data.markdown.trim()) {
      setCanSave(false);
    } else {
      setCanSave(true);
    }
    edits.current = data;
  };

  const handleOnSave = async (commitMessage) => {
    try {
      await onSave({ ...edits.current, commitMessage });
      edits.current = null;
      setCanSave(false);
    } catch (error) {
      console.error("there was an error attempting to save your changes");
    }
  };

  return (
    <LocationProvider location={currentRoute}>
      <PreviewModeController
        enabled={previewMode}
        loading={loading}
        onToggle={onTogglePreviewMode}
        {...{ branches, workingRepo, workingBranch, baseBranch }}
      >
        <BranchSwitcher onSubmit={onRequestToSwitchBranch} />
        <BranchCreator onSubmit={onRequestToCreateBranch} />
        <KnowledgePageCreator onSubmit={onRequestToCreatePage} />
        <ContentCommitter disabled={!canSave} onSubmit={handleOnSave} />
        <ApplicationCreator
          {...{
            applicationTypes,
            applications,
            environments,
            referenceTypes,
          }}
          onSubmit={onRequestToCreateApplication}
        />
        <PullRequestCreator onSubmit={onRequestToCreatePullRequest} />
      </PreviewModeController>

      <Helmet>
        <title>{`${pageTitle} | ${siteTitle}`}</title>
      </Helmet>

      <PageHeader {...{ siteTitle, version, logoSrc, navItems, loading }} />

      <Container>
        <Breadcrumb
          links={breadcrumbLinks}
          loading={loading}
          activeRoute={pageTitle}
          classNames={styles.breadcrumb}
        />
      </Container>

      <AsideAndMainContainer rootClasses={styles.mainContainer}>
        <Main>
          <section className={clsx(styles.section, styles.mainArticleSection)}>
            <article>
              {!loading && (
                <Typography variant="h1" paragraph>
                  {pageTitle}
                </Typography>
              )}
              <MarkdownContent
                readOnly={!previewMode}
                defaultValue={bodyContent}
                onChange={handleOnEdit}
                onRequestToUploadImage={onRequestToUploadImage}
                ref={editorRef}
                loading={loading}
              />
            </article>
          </section>

          <section className={styles.section}>
            <ComplianceTable
              loading={loading}
              title={complianceTableTitle}
              applications={complianceTableApplications}
              onAcceptOfRisk={complianceTableOnAcceptOfRisk}
              invalidPermissionsMessage={
                complianceTableInvalidPermissionsMessage
              }
              noDataMessage={complianceTableNoDataMessage}
            />
          </section>

          <section>
            <ControlOverview
              loading={loading}
              title={controlOverviewTitle}
              data={controlOverviewData}
              {...{
                onRequestOfControlsData,
                onRequestOfResourcesData,
                onResourceExemptionDelete,
                onResourceExemptionSave,
              }}
            />
          </section>
        </Main>

        <Aside classes={styles.asideContainer}>
          {(() => {
            if (loading || knowledgeLinks.length > 0) {
              return (
                <Menu
                  loading={loading}
                  menuTitle="Knowledge"
                  menuItems={knowledgeLinks}
                  initialCollapsed
                />
              );
            }
          })()}

          {(() => {
            if ((!previewMode && tocData.length > 0) || loading)
              return (
                <Menu
                  loading={loading}
                  menuTitle="Table of Contents"
                  menuItems={tocData}
                />
              );
          })()}
        </Aside>
      </AsideAndMainContainer>
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
    asideContainer: {
      "& > *:not(:last-child)": {
        marginBottom: theme.spacing(4),
      },
    },
    rule: {
      margin: theme.spacing(4, 0),
      border: 0,
      width: "100%",
      height: 1,
      backgroundColor: theme.palette.divider,
    },
    editButton: {
      marginBottom: theme.spacing(3),
    },
    section: {
      paddingBottom: theme.spacing(8),
      marginBottom: theme.spacing(8),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    mainArticleSection: {
      paddingBottom: 0,
    },
  };
});

ApplicationsTemplate.propTypes = {
  /**
   * Presents the component in a loading state (for when fetching data async)
   */
  loading: PropTypes.bool,
  /**
   * Used to render or hide the content edit button and show of hide the preview controller UI
   */
  previewMode: PropTypes.bool,
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
   * Used to populate the aside knowledge menu (see [Menu](/?path=/docs/modules-menu) `menuItems` prop API for schema)
   */
  knowledgeLinks: PropTypes.array,
  /**
   * Used to set an optional title for the compliance table
   */
  complianceTableTitle: PropTypes.string,
  /**
   * Used to render the compliance table data, if no data is passed the table will not render (see [ComplianceTable](/?path=/docs/modules-compliance-table) `applications` prop API for schema)
   */
  complianceTableApplications: PropTypes.array,
  /**
   * Callback for when a user accepts a risk dialog in the ComplianceTable (see [ComplianceTable](/?path=/docs/modules-compliance-table) `onAcceptOfRisk` prop API for details)
   */
  complianceTableOnAcceptOfRisk: PropTypes.func,
  /**
   * Used to display a message to the user when they do not have required permissions to view the application data
   */
  complianceTableInvalidPermissionsMessage: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  /**
   * Used to display a message to the user when there is no data to display for the application
   */
  complianceTableNoDataMessage: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  /**
   * Used to set the working repo for the PreviewModeController
   */
  workingRepo: PropTypes.string,
  /**
   * Used to set the working branch name for the PreviewModeController
   */
  workingBranch: PropTypes.string,
  /**
   * Used to set the base branch for the PreviewModeController
   */
  baseBranch: PropTypes.string,
  /**
   * Used to set the available branches for the PreviewModeController (see [PreviewModeController](/?path=/docs/modules-preview-mode-controller) `branches` prop API for schema)
   */
  branches: PropTypes.array,
  /**
   * Callback when a user clicks the toggle preview mode button in the PreviewModeController (see [PreviewModeController](/?path=/docs/modules-preview-mode-controller) `onToggle` prop API for details)
   */
  onTogglePreviewMode: PropTypes.func,
  /**
   * Callback when in edit mode and a user has requested to edit the main bodyContent. **Signature:** `function() => void`
   */
  onRequestToEditContent: PropTypes.func,
  /**
   * Callback when a user requests to switch a branch using the PreviewModeController, (see [PreviewModeController - BranchSwitcher](/?path=/docs/modules-preview-mode-controller) `onSubmit` prop API for details)
   */
  onRequestToSwitchBranch: PropTypes.func,
  /**
   * Callback when a user requests to create a branch using the PreviewModeController, (see [PreviewModeController - BranchCreator](/?path=/docs/modules-preview-mode-controller) `onSubmit` prop API for details)
   */
  onRequestToCreateBranch: PropTypes.func,
  /**
   * Callback when a user requests to create a page using the PreviewModeController, (see [PreviewModeController - PageCreator](/?path=/docs/modules-preview-mode-controller) `onSubmit` prop API for details)
   */
  onRequestToCreatePage: PropTypes.func,
  /**
   * Callback when a user requests to create a pull request, (see [PreviewModeController - PullRequestCreator](/?path=/docs/modules-preview-mode-controller) `onSubmit` prop API for details))
   */
  onRequestToCreatePullRequest: PropTypes.func,
  /**
   * Callback when Markdown editor has had a user upload an image. **Singnature: `function(file: Blob) : Promise`
   */
  onRequestToUploadImage: PropTypes.func,
  /**
   * Callback when a user requests to save content. **Signature: `function({markdown: String, images: Array, commitMessage: String}) : Promise`
   */
  onSave: PropTypes.func,
  /**
   * Used for the ApplicationCreator (see [PreviewModeController - ApplicationCreator](/?path=/docs/modules-preview-mode-controller) `applications` prop API for details)
   */
  applications: PropTypes.array,
  /**
   * Used for the ApplicationCreator (see [PreviewModeController - ApplicationCreator](/?path=/docs/modules-preview-mode-controller) `applicationTypes` prop API for details)
   */
  applicationTypes: PropTypes.array,
  /**
   * Used for the ApplicationCreator (see [PreviewModeController - ApplicationCreator](/?path=/docs/modules-preview-mode-controller) `environments` prop API for details)
   */
  environments: PropTypes.array,
  /**
   * Used for the ApplicationCreator (see [PreviewModeController - ApplicationCreator](/?path=/docs/modules-preview-mode-controller) `referenceTypes` prop API for details)
   */
  referenceTypes: PropTypes.array,
  /**
   * Used for the ApplicationCreator (see [PreviewModeController - ApplicationCreator](/?path=/docs/modules-preview-mode-controller) `onSubmit` prop API for details)
   */
  onRequestToCreateApplication: PropTypes.func,
  /**
   * Used to set the title for the ControlOverview component (see [ControlOverview](/?path=/docs/modules-control-overview--default) `title` prop API for details)
   */
  controlOverviewTitle: PropTypes.string,
  /**
   * Used to set the data for the ControlOverview component (see [ControlOverview](/?path=/docs/modules-control-overview--default) `data` prop API for details)
   */
  controlOverviewData: PropTypes.object,
  /**
   * Callback when a user requests a specific control group data for the ControlOverview component (see [ControlOverview](/?path=/docs/modules-control-overview--default) `onRequestOfControlsData` prop API for details)
   */
  onRequestOfControlsData: PropTypes.func,
  /**
   * Callback when a user requests a specific controls resources data for the ControlOverview component (see [ControlOverview](/?path=/docs/modules-control-overview--default) `onRequestOfResourcesData` prop API for details)
   */
  onRequestOfResourcesData: PropTypes.func,
  /**
   * Callback when a user requests to delete a specific resource exemption within the ControlOverview component (see [ControlOverview](/?path=/docs/modules-control-overview--default) `onResourceExemptionDelete` prop API for details)
   */
  onResourceExemptionDelete: PropTypes.func,
  /**
   * Callback when a user requests to change the date of a specific resource exemption within the ControlOverview component (see [ControlOverview](/?path=/docs/modules-control-overview--default) `onResourceExemptionSave` prop API for details)
   */
  onResourceExemptionSave: PropTypes.func,
};
