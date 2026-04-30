import express, { Request, Response } from "express";
import { OpenAPIBackend } from "openapi-backend";
import swaggerUi from "swagger-ui-express";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";
import YAML from "yamljs";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { EventPassService_list } from "./handlers/EventPassService_list";
import { EventPassService_create } from "./handlers/EventPassService_create";
import { EventPassService_get } from "./handlers/EventPassService_get";
import { EventPassService_update } from "./handlers/EventPassService_update";
import { EventPassService_delete } from "./handlers/EventPassService_delete";
import { EventPassService_capacityInsights } from "./handlers/EventPassService_capacityInsights";
import { EventPassService_tracking } from "./handlers/EventPassService_tracking";
import { StudentService_recommendations } from "./handlers/StudentService_recommendations";
import { buildContext } from "./graphql/context";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";

/** CORS headers for browser clients (e.g. localhost:5173). */
function setCorsHeaders(req: Request, res: Response): void {
  const origin = req.headers.origin;
  if (typeof origin === "string" && origin.length > 0) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export async function createApp() {
  const app = express();
  const specPath = path.join(__dirname, "..", "openapi.yaml");

  app.use((req, res, next) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });
  app.use(express.json());

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
    EventPassService_tracking,
    StudentService_recommendations,
    validationFail: (_c, _req, res) =>
      res.status(400).json({ code: 400, message: "Bad Request" }),
    notFound: (_c, _req, res) => res.status(404).json({ code: 404, message: "Not Found" }),
  });

  await api.init();

  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  app.post("/graphql", expressMiddleware(apolloServer, { context: buildContext }));

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
    swaggerUi.setup(undefined, { swaggerOptions: { url: "/openapi.yaml" } })
  );

  app.use((req, res) => api.handleRequest(req as any, req, res));
  return app;
}
