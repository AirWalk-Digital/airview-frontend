import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  data,
  messages,
  useComplianceTableDemoController,
} from "./compliance-table-demo-controller";
import { ComplianceTable } from "../../components/compliance-table";

const config = {
  title: "Modules/Compliance Table",
  component: ComplianceTable,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        root: {
          width: "100%",
          maxWidth: 1024,
          margin: "0 auto",
        },
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

function Default() {
  const {
    applicationData,
    handleOnAcceptOfRisk,
  } = useComplianceTableDemoController([...data]);

  return (
    <ComplianceTable
      title="Compliance Table"
      applications={applicationData}
      onAcceptOfRisk={handleOnAcceptOfRisk}
      noDataMessage={messages.noDataMessage}
      invalidPermissionsMessage={messages.invalidPermissionsMessage}
    />
  );
}

function WithNoData() {
  const {
    applicationData,
    handleOnAcceptOfRisk,
  } = useComplianceTableDemoController([]);

  return (
    <ComplianceTable
      title="Compliance Table"
      applications={applicationData}
      onAcceptOfRisk={handleOnAcceptOfRisk}
      noDataMessage={messages.noDataMessage}
      invalidPermissionsMessage={messages.invalidPermissionsMessage}
    />
  );
}

function WithoutRequiredPermissions() {
  const {
    applicationData,
    handleOnAcceptOfRisk,
  } = useComplianceTableDemoController(null);

  return (
    <ComplianceTable
      title="Compliance Table"
      applications={applicationData}
      onAcceptOfRisk={handleOnAcceptOfRisk}
      noDataMessage={messages.noDataMessage}
      invalidPermissionsMessage={messages.invalidPermissionsMessage}
    />
  );
}

function Loading() {
  const {
    applicationData,
    handleOnAcceptOfRisk,
  } = useComplianceTableDemoController(null);

  return (
    <ComplianceTable
      title="Compliance Table"
      applications={applicationData}
      loading={true}
      onAcceptOfRisk={handleOnAcceptOfRisk}
      noDataMessage={messages.noDataMessage}
      invalidPermissionsMessage={messages.invalidPermissionsMessage}
    />
  );
}

export default config;
export { Default, WithNoData, WithoutRequiredPermissions, Loading };
