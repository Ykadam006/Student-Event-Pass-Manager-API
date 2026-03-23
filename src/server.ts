import express, { Request, Response } from "express";
import { OpenAPIBackend } from "openapi-backend";
import swaggerUi from "swagger-ui-express";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";
import YAML from "yamljs";

import { EventPassService_list } from "./handlers/EventPassService_list";
import { EventPassService_create } from "./handlers/EventPassService_create";
import { EventPassService_get } from "./handlers/EventPassService_get";
import { EventPassService_update } from "./handlers/EventPassService_update";
import { EventPassService_delete } from "./handlers/EventPassService_delete";
import { EventPassService_capacityInsights } from "./handlers/EventPassService_capacityInsights";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const specPath = path.join(__dirname, "..", "openapi.yaml");

const api = new OpenAPIBackend({
  definition: specPath,
  validate: true,
  customizeAjv: (ajv) => {
    addFormats(ajv);
    return ajv;
  },
});

api.register({
  EventPassService_list,
  EventPassService_create,
  EventPassService_get,
  EventPassService_update,
  EventPassService_delete,
  EventPassService_capacityInsights,

  validationFail: (_c, _req, res) =>
    res.status(400).json({ code: 400, message: "Bad Request" }),

  notFound: (_c, _req, res) =>
    res.status(404).json({ code: 404, message: "Not Found" }),
});

api.init();

app.get("/openapi.yaml", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/yaml");
  res.send(fs.readFileSync(specPath, "utf-8"));
});

app.get("/openapi.json", (_req: Request, res: Response) => {
  res.json(YAML.load(specPath));
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/openapi.yaml",
    },
  })
);

app.use((req, res) => api.handleRequest(req as any, req, res));

app.listen(port, () => {
  console.log(`Campus Event Pass Manager API running on http://localhost:${port}`);
  console.log("Swagger docs available at /docs");
});
