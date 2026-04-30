import { Context } from "openapi-backend";
import { Request, Response } from "express";
import { sendServerError } from "./handleError";
import { getEventTracking } from "../services/tracking.service";

export async function EventPassService_tracking(
  c: Context,
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = c.request.params as { id: string };
    const tracking = await getEventTracking(id);
    res.status(200).json(tracking);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    if (message.includes("not found")) {
      res.status(404).json({ code: 404, message });
      return;
    }
    sendServerError(res, err);
  }
}
