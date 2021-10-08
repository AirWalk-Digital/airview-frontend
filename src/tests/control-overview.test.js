import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { handlers } from "../stories/control-overview/mocks/handlers";
import * as data from "../stories/control-overview/mocks/data";
import {
  ControlOverview,
  useControlOverviewController,
} from "../components/control-overview";
import userEvent from "@testing-library/user-event";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

function Component() {
  const [state, setControlData, setInstanceData] = useControlOverviewController(
    "https://testapi.dev/quality-models"
  );

  const handleOnRequestOfControlsData = async (id) => {
    setControlData(
      id,
      `https://testapi.dev/applications/1/control-overviews?qualityModelId=${id}`
    );
  };

  const handleOnRequestOfInstancesData = async (id) => {
    setInstanceData(
      id,
      `https://testapi.dev/applications/1/monitored-resources?technicalControlId=${id}`
    );
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={state}
      onRequestOfControlsData={handleOnRequestOfControlsData}
      onRequestOfInstancesData={handleOnRequestOfInstancesData}
    />
  );
}

describe("ControlOverview - loading group data", () => {
  describe("with no issues", () => {
    it("should display a message indicating no issues", async () => {
      server.use(
        rest.get("https://testapi.dev/quality-models", (req, res, ctx) => {
          return res(ctx.json([]));
        })
      );

      render(<Component />);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      expect(screen.getByText(/^no issues$/i)).toBeInTheDocument();
    });
  });

  describe("with issues", () => {
    it("should output all group titles", async () => {
      render(<Component />);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      data.groups.forEach((group) => {
        expect(screen.getByText(group.title)).toBeInTheDocument();
      });
    });
  });

  describe("with network error", () => {
    it("should display an error message to the user", async () => {
      server.use(
        rest.get("https://testapi.dev/quality-models", (req, res) => {
          return res.networkError("Network error");
        })
      );

      render(<Component />);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      expect(screen.getByText(/^error$/i)).toBeInTheDocument();
    });
  });

  describe("with response error", () => {
    it("should display an error message to the user", async () => {
      server.use(
        rest.get("https://testapi.dev/quality-models", (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ message: "Error fetching data" })
          );
        })
      );

      render(<Component />);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      expect(screen.getByText(/^error$/i)).toBeInTheDocument();
    });
  });
});

describe("ControlOverview - when expanding a control group", () => {
  describe("with no issues", () => {
    beforeEach(async () => {
      render(<Component />);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      userEvent.click(
        screen.getByRole("button", { name: data.groups[1].title })
      );

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    });

    it("should display a no issues message to the user", async () => {
      expect(screen.getByText(/^no issues$/i)).toBeInTheDocument();
    });

    it("should not re-fetch data on subsequent expansions of the resolved control group", async () => {
      const groupButton = screen.getByRole("button", {
        name: data.groups[1].title,
      });

      userEvent.click(groupButton);
      userEvent.click(groupButton);

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText(/^no issues$/i)).toBeInTheDocument();
    });
  });

  describe("with issues", () => {
    beforeEach(async () => {
      render(<Component />);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      const groupButton = screen.getByRole("button", {
        name: data.groups[0].title,
      });

      userEvent.click(groupButton);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    });

    it("should output all group controls", async () => {
      data.controls[1].forEach((control) => {
        expect(screen.getByText(control.name)).toBeInTheDocument();
      });
    });

    it("should not re-fetch data on subsequent expansions of the resolved control group", async () => {
      const groupButton = screen.getByRole("button", {
        name: data.groups[0].title,
      });

      userEvent.click(groupButton);
      userEvent.click(groupButton);

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

      data.controls[1].forEach((control) => {
        expect(screen.getByText(control.name)).toBeInTheDocument();
      });
    });
  });

  describe("with network error", () => {
    beforeEach(async () => {
      server.use(
        rest.get(
          "https://testapi.dev/applications/:application_id/control-overviews/",
          (req, res) => {
            return res.networkError("Network error");
          }
        )
      );

      render(<Component />);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      userEvent.click(
        screen.getByRole("button", { name: data.groups[2].title })
      );

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    });

    it("should display an error message to the user", async () => {
      expect(screen.getByText(/^error$/i)).toBeInTheDocument();
    });

    it("should attempt to re-fetch the data on subsequent expansions of the resolved control group", async () => {
      const groupButton = screen.getByRole("button", {
        name: data.groups[2].title,
      });

      userEvent.click(groupButton);
      userEvent.click(groupButton);

      expect(screen.queryByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("with response error", () => {
    beforeEach(async () => {
      server.use(
        rest.get(
          "https://testapi.dev/applications/:application_id/control-overviews/",
          (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ message: "Error fetching data" })
            );
          }
        )
      );

      render(<Component />);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      userEvent.click(
        screen.getByRole("button", { name: data.groups[2].title })
      );

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    });

    it("should display an error message to the user", async () => {
      expect(screen.getByText(/^error$/i)).toBeInTheDocument();
    });

    it("should attempt to re-fetch the data on subsequent expansions of the resolved control group", async () => {
      const groupButton = screen.getByRole("button", {
        name: data.groups[2].title,
      });

      userEvent.click(groupButton);
      userEvent.click(groupButton);

      expect(screen.queryByRole("progressbar")).toBeInTheDocument();
    });
  });
});

describe("ControlOverview - when expanding a control item", () => {
  describe("with no instances data", () => {
    beforeEach(async () => {
      render(<Component />);

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      userEvent.click(
        screen.getByRole("button", { name: data.groups[0].title })
      );

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      userEvent.click(screen.getByText(data.controls[1][1].name));

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    });

    it("should display a no issues message to the user", async () => {
      expect(screen.getByText(/^no issues$/i)).toBeInTheDocument();
    });

    it("should not re-fetch data on subsequent expansions of the resolved control item", async () => {
      const controlButton = screen.getByText(data.controls[1][1].name);

      userEvent.click(controlButton);
      userEvent.click(controlButton);

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText(/^no issues$/i)).toBeInTheDocument();
    });
  });

  describe("with instance data", () => {
    beforeEach(async () => {
      render(<Component />);
      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      userEvent.click(
        screen.getByRole("button", { name: data.groups[0].title })
      );

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
      userEvent.click(screen.getByText(data.controls[1][0].name));
      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    });

    it("should output the instance data", async () => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should not re-fetch data on subsequent expansions of the resolved control item", () => {
      userEvent.click(screen.getByText(data.controls[1][0].name));
      userEvent.click(screen.getByText(data.controls[1][0].name));

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("with network error", () => {
    beforeEach(async () => {
      server.use(
        rest.get(
          "https://testapi.dev/applications/:application_id/monitored-resources",
          (req, res) => {
            return res.networkError("Network error");
          }
        )
      );

      render(<Component />);
      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      userEvent.click(
        screen.getByRole("button", { name: data.groups[0].title })
      );

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
      userEvent.click(screen.getByText(data.controls[1][2].name));
      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    });

    it("should display an error message to the user", () => {
      expect(screen.getByText(/^error$/i)).toBeInTheDocument();
    });

    it("should attempt to re-fetch the data on subsequent expansions of the resolved control item", async () => {
      userEvent.click(screen.getByText(data.controls[1][2].name));
      userEvent.click(screen.getByText(data.controls[1][2].name));

      expect(screen.queryByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("with response error", () => {
    beforeEach(async () => {
      server.use(
        rest.get(
          "https://testapi.dev/applications/:application_id/monitored-resources",
          (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ message: "Error fetching data" })
            );
          }
        )
      );

      render(<Component />);
      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

      userEvent.click(
        screen.getByRole("button", { name: data.groups[0].title })
      );

      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
      userEvent.click(screen.getByText(data.controls[1][2].name));
      await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    });

    it("should display an error message to the user", () => {
      expect(screen.getByText(/^error$/i)).toBeInTheDocument();
    });

    it("should attempt to re-fetch the data on subsequent expansions of the resolved control item", async () => {
      userEvent.click(screen.getByText(data.controls[1][2].name));
      userEvent.click(screen.getByText(data.controls[1][2].name));

      expect(screen.queryByRole("progressbar")).toBeInTheDocument();
    });
  });
});

describe("ControlOverview - instance table", () => {
  it("should allow a user to sort data by last seen date", async () => {
    render(<Component />);

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    userEvent.click(screen.getByRole("button", { name: data.groups[0].title }));

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    userEvent.click(screen.getByText(data.controls[1][0].name));

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    const sortButton = screen.getByRole("button", {
      name: /sort by last seen/i,
    });

    const getTestTableData = () => {
      return document.querySelectorAll("tbody > tr > td:first-of-type");
    };

    const initialData = getTestTableData();

    userEvent.click(sortButton);

    const sortedData = getTestTableData();

    expect(initialData[initialData.length - 1]).toEqual(sortedData[0]);
  });

  it("should allow a user to filter data", async () => {
    render(<Component />);

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    userEvent.click(screen.getByRole("button", { name: data.groups[0].title }));

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    userEvent.click(screen.getByText(data.controls[1][0].name));

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    expect(
      screen.getByRole("cell", { name: /production/i })
    ).toBeInTheDocument();

    userEvent.click(
      screen.getByRole("button", {
        name: /show filters/i,
      })
    );

    userEvent.click(
      screen.getByRole("menuitem", { name: /filter by development/i })
    );

    expect(screen.queryByRole("cell", { name: /production/i })).toBeNull();
  });

  it("should not render the sorting UI if the instance count is less than two", async () => {
    server.use(
      rest.get(
        "https://testapi.dev/applications/:application_id/monitored-resources",
        (req, res, ctx) => {
          return res(ctx.json([data.instances[1][0]]));
        }
      )
    );

    render(<Component />);

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    userEvent.click(screen.getByRole("button", { name: data.groups[0].title }));

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    userEvent.click(screen.getByText(data.controls[1][0].name));

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    expect(
      screen.queryByRole("button", { name: /sort by last seen/i })
    ).toBeNull();
  });

  it("should not render the filtering UI if the filter count is less than two", async () => {
    server.use(
      rest.get(
        "https://testapi.dev/applications/:application_id/monitored-resources",
        (req, res, ctx) => {
          return res(ctx.json([data.instances[1][0]]));
        }
      )
    );

    render(<Component />);

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    userEvent.click(screen.getByRole("button", { name: data.groups[0].title }));

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    userEvent.click(screen.getByText(data.controls[1][0].name));

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    expect(screen.queryByRole("button", { name: /show filters/i })).toBeNull();
  });
});
