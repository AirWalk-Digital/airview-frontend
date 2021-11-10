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

function makeSubComponentArgs(rejectPromise) {
  const delay = process.env.NODE_ENV === "test" ? 0 : 1000;
  const log = process.env.NODE_ENV !== "test";

  return {
    branchSwitcherArgs: {
      onSubmit: (branchName) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            log && console.log(branchName);

            if (rejectPromise) {
              reject({
                error: "Error: Unable to switch branch, please try again",
              });
            } else {
              resolve();
            }
          }, delay);
        });
      },
    },
    branchCreatorArgs: {
      onSubmit: (branchName) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            log && console.log(branchName);

            if (rejectPromise) {
              reject({
                error: "Error: Unable to create branch, please try again",
              });
            } else {
              resolve();
            }
          }, delay);
        });
      },
    },
    knowledgePageCreatorArgs: {
      onSubmit: (formData) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            log && console.log(formData);

            if (rejectPromise) {
              reject({
                error:
                  "Error: Unable to create a new Knowledge page, please try again",
              });
            } else {
              resolve();
            }
          }, delay);
        });
      },
    },
    knowledgePageMetaEditorArgs: {
      onSubmit: (formData) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            log && console.log(formData);

            if (rejectPromise) {
              reject({
                error:
                  "Error: Unable to submit page meta changes, please try again",
              });
            } else {
              resolve();
            }
          }, delay);
        });
      },
      initialData: {
        title: "Test document title",
        reviewDate: dayjs().subtract(1, "day").toISOString(),
        userFacing: true,
      },
    },
    pageSectionCreatorArgs: {
      onSubmit: (sectionName) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            log && console.log(sectionName);

            if (rejectPromise) {
              reject({
                error:
                  "Error: Unable to create a page section, please try again",
              });
            } else {
              resolve();
            }
          }, delay);
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
      onSubmit: (formData) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            log && console.log(formData);

            if (rejectPromise) {
              reject({
                error: "Error: Unable to create application, please try again",
              });
            } else {
              resolve();
            }
          }, delay);
        });
      },
    },
    contentCommitterArgs: {
      onSubmit: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            log && console.log("Committing changes");

            if (rejectPromise) {
              reject({
                error: "Error: Unable to commit changes, please try again",
              });
            } else {
              resolve();
            }
          }, delay);
        });
      },
    },
    pullRequestCreatorArgs: {
      onSubmit: (from, to) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            log &&
              console.log(`PR request from branch "${from}" to branch "${to}"`);

            if (rejectPromise) {
              reject({
                error:
                  "Error: Unable to create a pull request, please try again",
              });
            } else {
              resolve("https://github.com");
            }
          }, delay);
        });
      },
    },
  };
}

function Template(args) {
  const {
    branchSwitcherArgs,
    branchCreatorArgs,
    knowledgePageCreatorArgs,
    knowledgePageMetaEditorArgs,
    pageSectionCreatorArgs,
    applicationCreatorArgs,
    contentCommitterArgs,
    pullRequestCreatorArgs,
    ...rest
  } = args;

  return (
    <PreviewModeController {...rest}>
      <BranchSwitcher {...branchSwitcherArgs} />
      <BranchCreator {...branchCreatorArgs} />
      <KnowledgePageCreator {...knowledgePageCreatorArgs} />
      <KnowledgePageMetaEditor {...knowledgePageMetaEditorArgs} />
      <PageSectionCreator {...pageSectionCreatorArgs} />
      <ApplicationCreator {...applicationCreatorArgs} />
      <ContentCommitter {...contentCommitterArgs} />
      <PullRequestCreator {...pullRequestCreatorArgs} />
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
  ...makeSubComponentArgs(),
};

Template.argTypes = {
  branchSwitcherArgs: {
    table: {
      disable: true,
    },
  },
  branchCreatorArgs: {
    table: {
      disable: true,
    },
  },
  knowledgePageCreatorArgs: {
    table: {
      disable: true,
    },
  },
  knowledgePageMetaEditorArgs: {
    table: {
      disable: true,
    },
  },
  pageSectionCreatorArgs: {
    table: {
      disable: true,
    },
  },
  applicationCreatorArgs: {
    table: {
      disable: true,
    },
  },
  contentCommitterArgs: {
    table: {
      disable: true,
    },
  },
  pullRequestCreatorArgs: {
    table: {
      disable: true,
    },
  },
  children: {
    control: false,
  },
};

const Loading = Template.bind({});

Loading.args = {
  ...Template.args,
};

Loading.argTypes = {
  ...Template.argTypes,
};

const Inactive = Template.bind({});

Inactive.args = {
  ...Template.args,
  enabled: false,
  loading: false,
};

Inactive.argTypes = {
  ...Template.argTypes,
};

const Active = Template.bind({});

Active.args = {
  ...Template.args,
  enabled: true,
  loading: false,
};

Active.argTypes = {
  ...Template.argTypes,
};

const ActiveWithErrors = Template.bind({});

ActiveWithErrors.args = {
  ...Template.args,
  enabled: true,
  loading: false,
  ...makeSubComponentArgs(true),
};

ActiveWithErrors.argTypes = {
  ...Template.argTypes,
};

export default config;
export { Loading, Inactive, Active, ActiveWithErrors };
