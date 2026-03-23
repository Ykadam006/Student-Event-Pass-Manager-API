import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as store from "../store/eventPasses";
import { EventPassUpdate } from "../types/eventPass";

export function EventPassService_update(c: Context, _req: Request, res: Response): void {
  const { id } = c.request.params as { id: string };
  const body = c.request.requestBody as EventPassUpdate;

  const updated = store.update(id, body);

  if (!updated) {
    res.status(404).json({ code: 404, message: "Event pass not found" });
    return;
  }

  res.status(200).json(updated);
}
