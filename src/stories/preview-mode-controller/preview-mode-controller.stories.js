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
    ApplicationCreator,
  },
  parameters: {
    layout: "padded",
  },
};

const applicationCreatorProps = {
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
};

const PageMetaEditorFormData = {
  title: "My Test Document *",
  reviewDate: dayjs().subtract(1, "day").toISOString(),
  userFacing: true,
};

function Loading(args) {
  return <PreviewModeController {...args}></PreviewModeController>;
}

Loading.args = {
  loading: true,
};

function Inactive(args) {
  return <PreviewModeController {...args}></PreviewModeController>;
}

Inactive.args = {
  enabled: false,
  loading: false,
};

function ActiveWithNoChanges(args) {
  const handleOnSubmit = async (data) => {
    console.log(data);

    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  const handleOnApplicationCreateSubmit = async (data) => {
    return new Promise((resolve, reject) => {
      const invalidApplicationName = applicationCreatorProps.applications.find(
        (application) => {
          return application.name === data.name;
        }
      );

      if (invalidApplicationName) {
        setTimeout(
          () =>
            reject(
              "Error: Application name exists, please re-name your application."
            ),
          2000
        );

        return;
      }

      setTimeout(() => {
        console.log(data);
        resolve();
      }, 2000);
    });
  };

  return (
    <PreviewModeController {...args}>
      <BranchSwitcher onSubmit={handleOnSubmit} />
      <BranchCreator onSubmit={handleOnSubmit} />
      <KnowledgePageCreator onSubmit={handleOnSubmit} />
      <KnowledgePageMetaEditor
        onSubmit={handleOnSubmit}
        initialData={PageMetaEditorFormData}
      />
      <PageSectionCreator onSubmit={handleOnSubmit} />
      <ApplicationCreator
        {...applicationCreatorProps}
        onSubmit={handleOnApplicationCreateSubmit}
      />
      <ContentCommitter disabled onSubmit={handleOnSubmit} />
    </PreviewModeController>
  );
}

ActiveWithNoChanges.args = {
  enabled: true,
  loading: false,
  branches: [
    { name: "master", protected: true },
    { name: "development", protected: false },
  ],
  workingRepo: "test-org/test-repository",
  workingBranch: "master",
};

function ActiveWithChanges(args) {
  const handleOnSubmit = async (args) => {
    console.log(args);

    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  const handleOnApplicationCreateSubmit = async (data) => {
    return new Promise((resolve, reject) => {
      const invalidApplicationName = applicationCreatorProps.applications.find(
        (application) => {
          return application.name === data.name;
        }
      );

      if (invalidApplicationName) {
        setTimeout(
          () =>
            reject(
              "Error: Application name exists, please re-name your application."
            ),
          2000
        );

        return;
      }

      setTimeout(() => {
        console.log(data);
        resolve();
      }, 2000);
    });
  };

  return (
    <PreviewModeController {...args}>
      <BranchSwitcher onSubmit={handleOnSubmit} />
      <BranchCreator onSubmit={handleOnSubmit} />
      <KnowledgePageCreator onSubmit={handleOnSubmit} />
      <KnowledgePageMetaEditor
        onSubmit={handleOnSubmit}
        initialData={PageMetaEditorFormData}
        disabled
      />
      <PageSectionCreator onSubmit={handleOnSubmit} />
      <ApplicationCreator
        {...applicationCreatorProps}
        onSubmit={handleOnApplicationCreateSubmit}
      />
      <ContentCommitter onSubmit={handleOnSubmit} />
    </PreviewModeController>
  );
}

ActiveWithChanges.args = {
  ...ActiveWithNoChanges.args,
};

export default config;
export { Loading, Inactive, ActiveWithNoChanges, ActiveWithChanges };
