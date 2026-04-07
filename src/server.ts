import "dotenv/config";

import type { Server } from "http";
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

/** CORS: browsers require these headers on cross-origin responses (e.g. localhost:5173 → Azure). */
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

app.use((req, res, next) => {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

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

async function start(): Promise<void> {
  try {
    await api.init();
  } catch (err) {
    console.error("OpenAPI init failed:", err);
    process.exit(1);
  }

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

  const n = Number(port);
  if (!Number.isFinite(n) || n < 1) {
    throw new Error(`Invalid PORT: ${String(port)}`);
  }

  const httpServer: Server = app.listen(n, "0.0.0.0");

  httpServer.once("error", (err: NodeJS.ErrnoException) => {
    console.error("HTTP server error:", err);
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${n} is already in use. Another server (or an old nodemon/tsx) is still running.`
      );
      console.error(`Fix: run  lsof -i :${n}  then  kill <PID>   or use  PORT=3001 npm run dev`);
    }
    process.exit(1);
  });

  httpServer.once("listening", () => {
    console.log(`Campus Event Pass Manager API running on http://localhost:${port}`);
    console.log(`Swagger UI: http://localhost:${port}/docs`);
    console.log(`GET / returns JSON (event list), not an HTML page`);
  });
}

start().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
