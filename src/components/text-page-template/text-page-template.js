import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { LayoutBase } from "../layout-base";
import { Menu } from "../menu";
import { MarkdownContent } from "../markdown-content";
import {
  PreviewModeController,
  BranchSwitcher,
  BranchCreator,
  PageCreator,
  PageMetaEditor,
  ContentCommitter,
  PullRequestCreator,
  ApplicationCreator,
} from "../preview-mode-controller";

/*
To do
- PropTypes
- Solution for PreviewModeController
*/

export function TextPageTemplate({
  relatedContent,
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
  mainContent,
  onEditorUploadImage,
  asideAndMain = true,
  tableOfContents = true,
  previewModeController = true,
  onTogglePreviewMode,
  workingRepo,
  workingBranch,
  baseBranch,
  branches,
  onSave,
  onRequestToSwitchBranch,
  onRequestToCreateBranch,
  onRequestToCreatePage,
  onRequestToEditPageMetaData,
  onRequestToCreatePullRequest,
  onRequestToCreateApplication,
  pageCreatorWidget = true,
  pageCreatorWidgetUserFacing = true,
  pageMetaEditorWidget = true,
  applicationEditorWidget = true,
  pageMetaData,
  applicationTypes,
  applications,
  environments,
  referenceTypes,
}) {
  const styles = useStyles();
  const editorRef = useRef();
  const editorChanges = useRef([]);
  const [tableOfContentsData, setTableOfContentsData] = useState([]);
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    const headings = editorRef.current;

    if (headings) {
      setTableOfContentsData(
        headings.map((heading) => ({
          label: heading.title,
          url: `#${heading.id}`,
        }))
      );
    }

    setCanSave(false);
  }, [mainContent]);

  const handleOnEditorChange = ({ markdown, index }) => {
    if (mainContent[index]?.defaultValue === markdown) {
      setCanSave(false);
    } else {
      setCanSave(true);
    }

    editorChanges.current[index] = markdown;
  };

  const handleOnSave = async (commitMessage) => {
    try {
      await onSave({
        edits: editorChanges.current,
        commitMessage,
      });
      editorChanges.current = [];
      setCanSave(false);
    } catch (error) {
      console.error("there was an error attempting to save your changes");
    }
  };

  return (
    <LayoutBase
      {...{
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
      }}
    >
      {previewModeController && (
        <PreviewModeController
          enabled={previewMode}
          loading={loading}
          onToggle={onTogglePreviewMode}
          branches={branches}
          workingRepo={workingRepo}
          workingBranch={workingBranch}
          baseBranch={baseBranch}
        >
          <BranchSwitcher onSubmit={onRequestToSwitchBranch} />
          <BranchCreator onSubmit={onRequestToCreateBranch} />

          {pageCreatorWidget && (
            <PageCreator
              onSubmit={onRequestToCreatePage}
              userFacing={pageCreatorWidgetUserFacing}
            />
          )}

          {pageMetaEditorWidget && (
            <PageMetaEditor
              onSubmit={onRequestToEditPageMetaData}
              initialData={pageMetaData}
              disabled={canSave}
            />
          )}

          {applicationEditorWidget && (
            <ApplicationCreator
              {...{
                applicationTypes,
                applications,
                environments,
                referenceTypes,
              }}
              onSubmit={onRequestToCreateApplication}
            />
          )}

          <ContentCommitter disabled={!canSave} onSubmit={handleOnSave} />
          <PullRequestCreator onSubmit={onRequestToCreatePullRequest} />
        </PreviewModeController>
      )}

      <Container>
        <Grid
          container
          component="section"
          spacing={2}
          className={styles.gridContainerRoot}
        >
          <Grid item xs={12} sm={asideAndMain ? 8 : 12} component="main">
            {!loading && (
              <Typography variant="h1" paragraph>
                {pageTitle}
              </Typography>
            )}
            <MarkdownContent
              loading={loading}
              readOnly={!previewMode}
              onChange={handleOnEditorChange}
              onUploadImage={onEditorUploadImage}
              content={mainContent}
              ref={editorRef}
            />
          </Grid>

          {asideAndMain && (
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              component="aside"
              className={styles.asideContainer}
            >
              {relatedContent && (
                <Menu
                  loading={loading}
                  menuTitle={relatedContent.title}
                  menuItems={relatedContent.links}
                  initialCollapsed
                  id="related-content"
                />
              )}

              {tableOfContents &&
                tableOfContentsData.length > 0 &&
                !previewMode && (
                  <Menu
                    loading={loading}
                    menuTitle="Table of Contents"
                    menuItems={tableOfContentsData}
                    id="table-of-contents"
                  />
                )}
            </Grid>
          )}
        </Grid>
      </Container>
    </LayoutBase>
  );
}

const useStyles = makeStyles((theme) => ({
  gridContainerRoot: {
    justifyContent: "space-between",
  },
  asideContainer: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(4),
    },
  },
}));

TextPageTemplate.propTypes = {
  relatedContent: PropTypes.shape({
    title: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
  currentRoute: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  logoSrc: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  previewMode: PropTypes.bool.isRequired,
  breadcrumbLinks: PropTypes.array.isRequired,
  mainContent: PropTypes.array.isRequired,
  onEditorChange: PropTypes.func,
  onEditorUploadImage: PropTypes.func,
  onSave: PropTypes.func,
  onTogglePreviewMode: PropTypes.func,
  asideAndMain: PropTypes.bool,
  tableOfContents: PropTypes.bool,
  onRequestToSwitchBranch: PropTypes.func,
  onRequestToCreateBranch: PropTypes.func,
  onRequestToCreatePage: PropTypes.func,
  onRequestToEditPageMetaData: PropTypes.func,
  onRequestToCreatePullRequest: PropTypes.func,
  onRequestToCreateApplication: PropTypes.func,
  previewModeController: PropTypes.bool,
  workingRepo: PropTypes.string,
  workingBranch: PropTypes.string,
  baseBranch: PropTypes.string,
  branches: PropTypes.array,
  pageCreatorWidget: PropTypes.bool,
  pageCreatorWidgetUserFacing: PropTypes.bool,
  pageMetaEditorWidget: PropTypes.bool,
  applicationEditorWidget: PropTypes.bool,
  pageMetaData: PropTypes.object,
  applicationTypes: PropTypes.array,
  applications: PropTypes.array,
  environments: PropTypes.array,
  referenceTypes: PropTypes.array,
};
