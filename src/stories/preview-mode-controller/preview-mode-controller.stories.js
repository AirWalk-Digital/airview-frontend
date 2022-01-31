import React from "react";
import * as BranchSwitcherStories from "../branch-switcher/branch-switcher.stories";
import * as BranchCreatorStories from "../branch-creator/branch-creator.stories";
import * as PageCreatorStories from "../page-creator/page-creator.stories";
import * as PageMetaEditorStories from "../page-meta-editor/page-meta-editor.stories";
import * as PageSectionCreatorStories from "../page-section-creator/page-section-creator.stories";
import * as ApplicationCreatorStories from "../application-creator/application-creator.stories";
import * as ContentCommitterStories from "../content-committer/content-committer.stories";
import * as PullRequestCreatorStories from "../pull-request-creator/pull-request-creator.stories";

import {
  PreviewModeController,
  BranchCreator,
  BranchSwitcher,
  PageCreator,
  PageMetaEditor,
  PageSectionCreator,
  ContentCommitter,
  ApplicationCreator,
  PullRequestCreator,
} from "../../components/preview-mode-controller";

export default {
  title: "Modules/Preview Mode Controller",
  component: PreviewModeController,
  subcomponents: {
    BranchSwitcher,
    BranchCreator,
    PageCreator,
    PageMetaEditor,
    PageSectionCreator,
    ContentCommitter,
    ApplicationCreator,
    PullRequestCreator,
  },
  parameters: {
    layout: "padded",
  },
  argTypes: {
    children: {
      control: false,
    },
  },
};

function Template(args) {
  return (
    <PreviewModeController {...args}>
      <BranchSwitcher {...BranchSwitcherStories.Closed.args} />
      <BranchCreator {...BranchCreatorStories.Closed.args} />
      <PageCreator {...PageCreatorStories.Closed.args} />
      <PageMetaEditor {...PageMetaEditorStories.ClosedNotDisabled.args} />
      <PageSectionCreator {...PageSectionCreatorStories.Closed.args} />
      <ApplicationCreator {...ApplicationCreatorStories.Closed.args} />
      <ContentCommitter {...ContentCommitterStories.Closed.args} />
      <PullRequestCreator {...PullRequestCreatorStories.Closed.args} />
    </PreviewModeController>
  );
}

Template.args = {
  branches: [
    { name: "main", protected: true },
    { name: "development", protected: false },
  ],
  workingRepo: "test-org/test-repository",
  workingBranch: "development",
  baseBranch: "main",
};

export const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
  enabled: false,
  loading: true,
};

export const Inactive = Template.bind({});

Inactive.args = {
  ...Template.args,
  enabled: false,
  loading: false,
};

export const Active = Template.bind({});

Active.args = {
  ...Template.args,
  enabled: true,
  loading: false,
};
