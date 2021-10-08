import { rest } from "msw";
import { groups, controls, instances } from "./data";

const delay = process.env.NODE_ENV === "test" ? 0 : 2000;

export const handlers = [
  rest.get("https://testapi.dev/quality-models", (req, res, ctx) => {
    return res(ctx.delay(delay), ctx.json(groups));
  }),
  rest.get(
    "https://testapi.dev/applications/:application_id/control-overviews/",
    (req, res, ctx) => {
      const controlId = req.url.searchParams.get("qualityModelId");

      if (controlId === "3") {
        return res(
          ctx.delay(delay),
          ctx.status(500),
          ctx.json({ message: "Error fetching data" })
        );
      }

      return res(ctx.delay(delay), ctx.json(controls[controlId]));
    }
  ),
  rest.get(
    "https://testapi.dev/applications/:application_id/monitored-resources",
    (req, res, ctx) => {
      const technicalControlId = req.url.searchParams.get("technicalControlId");

      if (technicalControlId === "3") {
        return res(
          ctx.delay(delay),
          ctx.status(500),
          ctx.json({ message: "Error fetching data" })
        );
      }

      return res(ctx.delay(delay), ctx.json(instances[technicalControlId]));
    }
  ),
];
