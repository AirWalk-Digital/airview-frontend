import dayjs from "dayjs";

export const groups = [
  {
    id: 1,
    title: "Group will resolve controls with success",
  },
  {
    id: 2,
    title: "Group will resolve controls with no issues",
  },
  {
    id: 3,
    title: "Group will resolve controls with error",
  },
];

export const controls = {
  1: [
    {
      id: 1,
      name: "Control will resolve instances with success",
      severity: "Low",
      applied: 5,
      exempt: 6,
      control: {
        name: "Control label 1",
        url: "/",
      },
      frameworks: [
        {
          name: "FWRK1",
          url: "/",
        },
        {
          name: "FWRK2",
          url: "/",
        },
      ],
      controlType: "Control type test label 1",
      lifecycle: "Lifecycle test label 1",
    },
    {
      id: 2,
      name: "Control will resolve instances with no issues",
      severity: "Medium",
      applied: 5,
      exempt: 6,
      control: {
        name: "Control label 2",
        url: "/",
      },
      frameworks: [
        {
          name: "FWRK1",
          url: "/",
        },
        {
          name: "FWRK2",
          url: "/",
        },
      ],
      controlType: "Control type test label 2",
      lifecycle: "Lifecycle test label 2",
    },
    {
      id: 3,
      name: "Control will resolve instances with error",
      severity: "High",
      applied: 5,
      exempt: 6,
      control: {
        name: "Control label 3",
        url: "/",
      },
      frameworks: [
        {
          name: "FWRK1",
          url: "/",
        },
        {
          name: "FWRK2",
          url: "/",
        },
      ],
      controlType: "Control type test label 3",
      lifecycle: "Lifecycle test label 3",
    },
  ],
  2: [],
};

export const resources = {
  1: [
    {
      id: 1,
      type: "Test instance 1",
      reference: "Instance reference",
      environment: "Production",
      lastSeen: dayjs().toISOString(),
      status: "Monitoring",
      pending: false,
    },
    {
      id: 2,
      type: "Test instance 2",
      reference: "Instance reference",
      environment: "Development",
      lastSeen: dayjs().subtract(1, "year").toISOString(),
      status: "Non-Compliant",
      pending: false,
    },
    {
      id: 3,
      type: "Test instance 3",
      reference: "Instance reference",
      environment: "Development",
      lastSeen: dayjs().subtract(2, "year").toISOString(),
      status: "Exempt",
      pending: false,
      exemptionData: {
        ticket: "Ticket label for test instance 3",
        expires: dayjs().toISOString(),
        resources: ["Resource One", "Resource Two", "Resource Three"],
      },
    },
    {
      id: 4,
      type: "Test instance 4",
      reference: "Instance reference",
      environment: "Development",
      lastSeen: dayjs().subtract(2, "year").toISOString(),
      status: "Exempt",
      pending: false,
      exemptionData: {
        ticket: "Ticket label for test instance 4",
        expires: dayjs().add(2, "day").toISOString(),
        resources: ["Resource One", "Resource Two", "Resource Three"],
      },
    },
    {
      id: 5,
      type: "Test instance 5",
      reference: "Instance reference",
      environment: "Development",
      lastSeen: dayjs().subtract(2, "year").toISOString(),
      status: "Exempt",
      pending: true,
    },
  ],
  2: [],
};
