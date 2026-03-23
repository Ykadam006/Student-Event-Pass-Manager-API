import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as store from "../store/eventPasses";

export function EventPassService_delete(c: Context, _req: Request, res: Response): void {
  const { id } = c.request.params as { id: string };
  const deleted = store.remove(id);

  if (!deleted) {
    res.status(404).json({ code: 404, message: "Event pass not found" });
    return;
  }

  res.status(200).json({ message: "Event pass deleted successfully" });
}
