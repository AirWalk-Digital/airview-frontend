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

export function TextPageTemplate({
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
  mainContentProps,
  asideContentProps,
  previewModeControllerProps,
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
          url: `${currentRoute}/#${heading.id}`,
        }))
      );
    }

    setCanSave(false);
  }, [mainContentProps]);

  const handleOnEditorChange = ({ markdown, index }) => {
    if (mainContentProps?.content[index].defaultValue === markdown) {
      setCanSave(false);
    } else {
      setCanSave(true);
    }

    editorChanges.current[index] = markdown;
  };

  const handleOnSave = async (commitMessage) => {
    try {
      await previewModeControllerProps.onSave({
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
        loading,
        previewMode,
        pageTitle,
        siteTitle,
        version,
        logoSrc,
        navItems,
        onQueryChange,
        currentRoute,
        breadcrumbLinks,
      }}
    >
      {previewModeControllerProps && (
        <PreviewModeController
          enabled={previewMode}
          loading={loading}
          onToggle={previewModeControllerProps.onToggle}
          branches={previewModeControllerProps.branches}
          workingRepo={previewModeControllerProps.workingRepo}
          workingBranch={previewModeControllerProps.workingBranch}
          baseBranch={previewModeControllerProps.baseBranch}
        >
          <BranchSwitcher
            onSubmit={previewModeControllerProps.onRequestToSwitchBranch}
          />
          <BranchCreator
            onSubmit={previewModeControllerProps.onRequestToCreateBranch}
          />

          {previewModeControllerProps?.pageCreatorProps && (
            <PageCreator {...previewModeControllerProps.pageCreatorProps} />
          )}

          {previewModeControllerProps?.pageMetaEditorProps && (
            <PageMetaEditor
              {...previewModeControllerProps.pageMetaEditorProps}
              disabled={canSave}
            />
          )}

          {previewModeControllerProps?.applicationCreatorProps && (
            <ApplicationCreator
              {...previewModeControllerProps.applicationCreatorProps}
            />
          )}

          <ContentCommitter disabled={!canSave} onSubmit={handleOnSave} />

          <PullRequestCreator
            onSubmit={previewModeControllerProps.onRequestToCreatePullRequest}
          />
        </PreviewModeController>
      )}

      <Container>
        <Grid
          container
          component="section"
          spacing={2}
          className={styles.gridContainerRoot}
        >
          <Grid item xs={12} sm={asideContentProps ? 8 : 12} component="main">
            {!loading && (
              <Typography variant="h1" paragraph>
                {pageTitle}
              </Typography>
            )}
            <MarkdownContent
              loading={loading}
              readOnly={!previewMode}
              onChange={handleOnEditorChange}
              ref={editorRef}
              {...mainContentProps}
            />
          </Grid>

          {asideContentProps && (
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              component="aside"
              className={styles.asideContainer}
            >
              {asideContentProps?.relatedContent && (
                <Menu
                  loading={loading}
                  initialCollapsed
                  id="related-content"
                  {...asideContentProps.relatedContent}
                />
              )}

              {asideContentProps?.tableOfContents &&
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

  mainContentProps: PropTypes.shape({
    onUploadImage: PropTypes.func,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        placeholder: PropTypes.string,
        defaultValue: PropTypes.string,
        additionalContent: PropTypes.node,
      })
    ),
  }),

  asideContentProps: PropTypes.shape({
    relatedContent: PropTypes.shape({
      menuTitle: PropTypes.string.isRequired,
      menuItems: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
    }),
    tableOfContents: PropTypes.bool.isRequired,
  }),

  previewModeControllerProps: PropTypes.shape({
    branches: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        protected: PropTypes.bool,
      })
    ).isRequired,
    workingRepo: PropTypes.string.isRequired,
    workingBranch: PropTypes.string.isRequired,
    baseBranch: PropTypes.string.isRequired,
    onToggle: PropTypes.func,
    onRequestToSwitchBranch: PropTypes.func.isRequired,
    onRequestToCreateBranch: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onRequestToCreatePullRequest: PropTypes.func.isRequired,
    pageCreatorProps: PropTypes.shape({
      onSubmit: PropTypes.func.isRequired,
      userFacing: PropTypes.bool,
    }),
    pageMetaEditorProps: PropTypes.shape({
      initialData: PropTypes.shape({
        title: PropTypes.string.isRequired,
        reviewDate: PropTypes.string.isRequired,
        userFacing: PropTypes.bool,
      }).isRequired,
      onSubmit: PropTypes.func.isRequired,
    }),
    applicationCreatorProps: PropTypes.shape({
      applicationTypes: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
        })
      ).isRequired,
      applications: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
        })
      ).isRequired,
      environments: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
        })
      ).isRequired,
      referenceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
      onSubmit: PropTypes.func.isRequired,
    }),
  }),
};
