import React from "react";
import dayjs from "dayjs";
import {
  PreviewModeController,
  BranchCreator,
  BranchSwitcher,
  KnowledgePageCreator,
  KnowledgePageMetaEditor,
  PageSectionCreator,
  ContentCommitter,
  ApplicationCreator,
  PullRequestCreator,
} from "../../components/preview-mode-controller";

const config = {
  title: "Modules/Preview Mode Controller",
  component: PreviewModeController,
  subcomponents: {
    BranchSwitcher,
    BranchCreator,
    KnowledgePageCreator,
    KnowledgePageMetaEditor,
    PageSectionCreator,
    ContentCommitter,
    ApplicationCreator,
    PullRequestCreator,
  },
  parameters: {
    layout: "padded",
  },
};

function Template(args) {
  const {
    enabled,
    onToggle,
    branches,
    workingRepo,
    workingBranch,
    baseBranch,
    loading,
    ...rest
  } = args;

  return (
    <PreviewModeController
      {...{
        enabled,
        onToggle,
        branches,
        workingRepo,
        workingBranch,
        baseBranch,
        loading,
      }}
    >
      <BranchSwitcher {...rest.branchSwitcherArgs} />
      <BranchCreator {...rest.branchCreatorArgs} />
      <KnowledgePageCreator {...rest.knowledgePageCreatorArgs} />
      <KnowledgePageMetaEditor {...rest.knowledgePageMetaEditorArgs} />
      <PageSectionCreator {...rest.pageSectionCreatorArgs} />
      <ApplicationCreator {...rest.applicationCreatorArgs} />
      <ContentCommitter {...rest.contentCommitterArgs} />
      <PullRequestCreator {...rest.pullRequestCreatorArgs} />
    </PreviewModeController>
  );
}

Template.args = {
  enabled: false,
  onToggle: () => {},
  branches: [
    { name: "master", protected: true },
    { name: "development", protected: false },
  ],
  workingRepo: "test-org/test-repository",
  workingBranch: "development",
  baseBranch: "master",
  loading: true,
  branchSwitcherArgs: {
    onSubmit: async (branchName) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(branchName);
          resolve();
        }, 2000);
      });
    },
  },
  branchCreatorArgs: {
    onSubmit: async (branchName) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(branchName);
          resolve();
        }, 2000);
      });
    },
  },
  knowledgePageCreatorArgs: {
    onSubmit: async (formData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(formData);
          resolve();
        }, 2000);
      });
    },
  },
  knowledgePageMetaEditorArgs: {
    onSubmit: async (formData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(formData);
          resolve();
        }, 2000);
      });
    },
    initialData: {
      title: "Test document title",
      reviewDate: dayjs().subtract(1, "day").toISOString(),
      userFacing: true,
    },
  },
  pageSectionCreatorArgs: {
    onSubmit: async (sectionName) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(sectionName);
          resolve();
        }, 2000);
      });
    },
  },
  applicationCreatorArgs: {
    applications: [
      {
        name: "Application One",
        id: 1,
      },
      {
        name: "Application Two",
        id: 2,
      },
    ],
    applicationTypes: [
      {
        name: "Type One",
        id: 1,
      },
      {
        name: "Type Two",
        id: 2,
      },
    ],
    environments: [
      {
        name: "Environment One",
        id: 1,
      },
      {
        name: "Environment Two",
        id: 2,
      },
    ],
    referenceTypes: ["type_one", "type_two"],
    onSubmit: async (formData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(formData);
          resolve();
        }, 2000);
      });
    },
  },
  contentCommitterArgs: {
    onSubmit: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Committing changes");
          resolve();
        }, 2000);
      });
    },
  },
  pullRequestCreatorArgs: {
    onSubmit: async (from, to) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`PR request from branch "${from}" to branch "${to}"`);
          resolve();
        }, 2000);
      });
    },
  },
};

const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
};

const Inactive = Template.bind({});

Inactive.args = {
  ...Template.args,
  enabled: false,
  loading: false,
};

const Active = Template.bind({});

Active.args = {
  ...Template.args,
  enabled: true,
  loading: false,
};

export default config;
export { Loading, Inactive, Active };
