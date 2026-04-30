import "dotenv/config";
import type { Server } from "http";
import { createApp } from "./app";

const port = process.env.PORT || 3000;

async function start(): Promise<void> {
  if (!process.env.SUPABASE_URL?.trim() || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    console.warn(
      "[config] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing — GET / and other data routes will return 500. Set them in .env (local) or Application settings (Azure)."
    );
  }

  const app = await createApp();

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
