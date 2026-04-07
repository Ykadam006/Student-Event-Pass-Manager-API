import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as store from "../store/eventPasses";
import { sendServerError } from "./handleError";

export async function EventPassService_delete(
  c: Context,
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = c.request.params as { id: string };
    const deleted = await store.remove(id);

    if (!deleted) {
      res.status(404).json({ code: 404, message: "Event pass not found" });
      return;
    }

    res.status(200).json({ message: "Event pass deleted successfully" });
  } catch (err) {
    sendServerError(res, err);
  }
}
