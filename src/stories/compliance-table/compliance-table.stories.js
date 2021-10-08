import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
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

const applicationsData = [
  {
    id: 1,
    controlType: "security",
    severity: "high",
    name: "Donec consectetuer ligula vulputate sem tristique cursus",
    tickets: [
      {
        reference: "INC12345678",
        type: "incident",
      },
    ],
    raisedDateTime: (function () {
      const now = new Date();
      now.setMinutes(now.getMinutes() - 10);
      return now.toISOString();
    })(),
    environment: "Production",
    applicationDetailData: {
      instances: [
        {
          id: 1,
          name: "Server Instance 1",
          status: "pending",
        },
        {
          id: 2,
          name: "Server Instance 2",
          status: "none",
        },
        {
          id: 3,
          name: "Server Instance 3",
          status: "none",
        },
      ],
      control: {
        name: "AWS ECS Pattern  CPU Monitoring",
        url: "/",
      },
      frameworks: [
        {
          name: "PCI-DSS",
          url: "/",
        },
        {
          name: "ISO27K",
          url: "/",
        },
        {
          name: "GPK",
          url: "/",
        },
      ],
      environment: "production",
      assignmentGroup: "Server Team",
      assignee: "James Brown",
      systemSource: "AWS/CCF",
      systemStage: "Monitor",
    },
  },
  {
    id: 2,
    controlType: "operational",
    severity: "medium",
    name: "Vivamus vestibulum ntulla nec ante",
    tickets: [
      {
        reference: "PRB12345678",
        type: "problem",
      },
    ],
    raisedDateTime: (function () {
      const now = new Date();
      now.setHours(now.getHours() - 1);
      return now.toISOString();
    })(),
    environment: "Production",
    applicationDetailData: {
      instances: [
        {
          id: 1,
          name: "Server Instance 1",
          status: "none",
        },
      ],
      control: {
        name: "AWS ECS Pattern  CPU Monitoring",
        url: "/",
      },
      frameworks: [
        {
          name: "PCI-DSS",
          url: "/",
        },
        {
          name: "ISO27K",
          url: "/",
        },
        {
          name: "GPK",
          url: "/",
        },
      ],
      environment: "production",
      assignmentGroup: "Server Team",
      assignee: "James Brown",
      systemSource: "AWS/CCF",
      systemStage: "Monitor",
    },
  },
  {
    id: 3,
    controlType: "task",
    severity: "low",
    name: "Integer vitae libero ac risus egestas placerat",
    tickets: [
      {
        reference: "INC12345678-ABT",
        type: "incident",
      },
      {
        reference: "PRB12345678",
        type: "problem",
      },
      {
        reference:
          "RSK12345678QJDTANDKRSK12345678QJDTANDKRSK12345678QJDTANDKRS",
        type: "risk",
      },
    ],
    raisedDateTime: (function () {
      const now = new Date();
      now.setDate(now.getDate() - 1);
      return now.toISOString();
    })(),
    environment: "UAT",
    applicationDetailData: {
      instances: [
        {
          id: 1,
          name: "Server Instance 1",
          status: "pending",
        },
      ],
      control: {
        name: "AWS ECS Pattern  CPU Monitoring",
        url: "/",
      },
      frameworks: [
        {
          name: "PCI-DSS",
          url: "/",
        },
        {
          name: "ISO27K",
          url: "/",
        },
        {
          name: "GPK",
          url: "/",
        },
      ],
      environment: "production",
      assignmentGroup: "Server Team",
      assignee: "James Brown",
      systemSource: "AWS/CCF",
      systemStage: "Monitor",
    },
  },
  {
    id: 4,
    controlType: "task",
    severity: "low",
    name: "Vivamus id diam bibendum, rhoncus leo quis, consequat",
    tickets: [
      {
        reference: "INC12345678-ABT",
        type: "incident",
      },
    ],
    raisedDateTime: (function () {
      const now = new Date();
      now.setMonth(now.getMonth() - 1);
      return now.toISOString();
    })(),
    environment: "UAT",
    applicationDetailData: {
      instances: [
        {
          id: 1,
          name: "Server Instance 1",
          status: "none",
        },
      ],
      control: {
        name: "AWS ECS Pattern  CPU Monitoring",
        url: "/",
      },
      frameworks: [
        {
          name: "PCI-DSS",
          url: "/",
        },
        {
          name: "ISO27K",
          url: "/",
        },
        {
          name: "GPK",
          url: "/",
        },
      ],
      environment: "production",
      assignmentGroup: "Server Team",
      assignee: "James Brown",
      systemSource: "AWS/CCF",
      systemStage: "Monitor",
    },
  },
  {
    id: 5,
    controlType: "security",
    severity: "medium",
    name: "Phasellus fermentum tincidunt nisl",
    tickets: [
      {
        reference: "PRB12345678",
        type: "problem",
      },
    ],
    raisedDateTime: (function () {
      const now = new Date();
      now.setFullYear(now.getFullYear() - 1);
      return now.toISOString();
    })(),
    environment: "UAT",
    applicationDetailData: {
      instances: [
        {
          id: 1,
          name: "Server Instance 1",
          status: "pending",
        },
      ],
      control: {
        name: "AWS ECS Pattern  CPU Monitoring",
        url: "/",
      },
      frameworks: [
        {
          name: "PCI-DSS",
          url: "/",
        },
        {
          name: "ISO27K",
          url: "/",
        },
        {
          name: "GPK",
          url: "/",
        },
      ],
      environment: "production",
      assignmentGroup: "Server Team",
      assignee: "James Brown",
      systemSource: "AWS/CCF",
      systemStage: "Monitor",
    },
  },
];

const messageData = {
  noDataMessage: {
    title: "No issues",
    message: "There are no issues to display for this application",
  },
  invalidPermissionsMessage: {
    title: "Notice",
    message:
      "You do not have the required permissions to view the data for this application",
  },
};

function Default() {
  // Clone our applicationsData into React state, would typically come via an async API call
  const [applicationData, setApplicationData] = useState([...applicationsData]);

  // Callback to handle a user accepting a risk/s via the dialog
  const handleOnAcceptOfRisk = async (formData) => {
    console.log("Form data", formData);

    // Typically we would make a request to the server (passing the form data), await a response
    // and update the applicationData state (to trigger a re-render).
    // Here we replicate that with mock, updating a given application instance state
    const moddifiedApplicationData = applicationData.map((data) => {
      if (data.id === formData.applicationId.value) {
        return {
          ...data,
          applicationDetailData: {
            ...data.applicationDetailData,
            instances: data.applicationDetailData.instances.map((instance) => ({
              ...instance,
              status: formData.resources.value.includes(instance.name)
                ? "pending"
                : instance.status,
            })),
          },
        };
      }
      return data;
    });

    // Callback excpects a promise resolution in response to the API call
    // Here we mock a successful resolution and update the applicationData state
    // after a timeout of 2.5 seconds
    return new Promise((resolve) =>
      setTimeout(() => {
        setApplicationData([...moddifiedApplicationData]);
        resolve();
      }, 2500)
    );
  };

  return (
    <ComplianceTable
      title="Compliance Table"
      applications={applicationData}
      onAcceptOfRisk={handleOnAcceptOfRisk}
      noDataMessage={messageData.noDataMessage}
      invalidPermissionsMessage={messageData.invalidPermissionsMessage}
    />
  );
}

function WithNoData() {
  return (
    <ComplianceTable
      title="Compliance Table"
      applications={[]}
      onAcceptOfRisk={() => {}}
      noDataMessage={messageData.noDataMessage}
      invalidPermissionsMessage={messageData.invalidPermissionsMessage}
    />
  );
}

function WithoutRequiredPermissions() {
  return (
    <ComplianceTable
      title="Compliance Table"
      applications={null}
      onAcceptOfRisk={() => {}}
      noDataMessage={messageData.noDataMessage}
      invalidPermissionsMessage={messageData.invalidPermissionsMessage}
    />
  );
}

function Loading() {
  return (
    <ComplianceTable
      title="Compliance Table"
      applications={null}
      loading={true}
      onAcceptOfRisk={() => {}}
    />
  );
}

export default config;
export { Default, WithNoData, WithoutRequiredPermissions, Loading };
