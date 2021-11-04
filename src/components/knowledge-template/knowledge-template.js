import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
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
import {
  PreviewModeController,
  BranchSwitcher,
  BranchCreator,
  KnowledgePageCreator,
  KnowledgePageMetaEditor,
  ContentCommitter,
  PullRequestCreator,
} from "../preview-mode-controller";
import { LocationProvider } from "../../hooks/use-location";
import { useEffect } from "react";

export function KnowledgeTemplate({
  loading,
  previewMode,
  currentRoute,
  siteTitle,
  pageTitle,
  version,
  logoSrc,
  navItems,
  breadcrumbLinks,
  relatedKnowledge,
  bodyContent,
  pageMetaData,
  workingRepo,
  workingBranch,
  baseBranch,
  branches,
  onTogglePreviewMode,
  onRequestToEditContent,
  onRequestToSwitchBranch,
  onRequestToCreateBranch,
  onRequestToCreatePage,
  onRequestToEditPageMetaData,
  onRequestToCreatePullRequest,
  onRequestToUploadImage,
  onSave,
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
        <KnowledgePageMetaEditor
          onSubmit={onRequestToEditPageMetaData}
          initialData={pageMetaData}
          disabled={canSave}
        />
        <ContentCommitter disabled={!canSave} onSubmit={handleOnSave} />
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
        </Main>

        <Aside classes={styles.asideContainer}>
          {(() => {
            if (loading || relatedKnowledge?.length > 0) {
              return (
                <Menu
                  loading={loading}
                  menuTitle="Related Knowledge"
                  menuItems={relatedKnowledge}
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
  };
});

KnowledgeTemplate.propTypes = {
  /**
   * Presents the component in a loading state (for when fetching data async)
   */
  loading: PropTypes.bool,
  /**
   * Used to render or hide the content edit button
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
   * Used to populate the aside related knowledge menu (see [Menu](/?path=/docs/modules-menu) `menuItems` prop API for schema)
   */
  relatedKnowledge: PropTypes.array,
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
   * Callback when a user requests to edit page metadata (frontmatter), (see [PreviewModeController - PageMetaEditor](/?path=/docs/modules-preview-mode-controller) `onSubmit` prop API for details))
   */
  onRequestToEditPageMetaData: PropTypes.func,
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
   * Used to populate the pageMetaEditor UI, (see [PreviewModeController - PageMetaEditor](/?path=/docs/modules-preview-mode-controller) `initialData` prop API for details))
   */
  pageMetaData: PropTypes.object,
};
