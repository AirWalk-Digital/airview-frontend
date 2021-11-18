import { rest } from "msw";
import { groups, controls, resources } from "./data";

const delay = process.env.NODE_ENV === "test" ? 0 : 500;

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

      return res(ctx.delay(delay), ctx.json(resources[technicalControlId]));
    }
  ),
  rest.get(
    "https://api.github.com/repos/AirWalk-Digital/airview_demo_applications/contents/microsoft_teams/_index.md",
    (req, res, ctx) => {
      const branch = req.url.searchParams.get("ref");

      const markdownResponse =
        branch === "main" ? "main branch content" : `${branch} content`;

      const encodedData = Buffer.from(markdownResponse).toString("base64");

      return res(ctx.json({ content: encodedData }));
    }
  ),
  rest.get(
    "/api/storage/applications/microsoft_teams/_index.md",
    (req, res, ctx) => {
      return res(ctx.json("Non-preview content"));
    }
  ),
  rest.get(
    "https://api.github.com/repos/AirWalk-Digital/airview_demo_applications/contents/microsoft_teams/knowledge/activity_feed_guide/_index.md",
    (req, res, ctx) => {
      const branch = req.url.searchParams.get("ref");

      const markdownResponse =
        branch === "main" ? "main branch content" : `${branch} content`;

      const encodedData = Buffer.from(markdownResponse).toString("base64");

      return res(ctx.json({ content: encodedData }));
    }
  ),
  rest.get(
    "/api/storage/applications/microsoft_teams/knowledge/activity_feed_guide/_index.md",
    (req, res, ctx) => {
      return res(ctx.json("Non-preview content"));
    }
  ),
];
