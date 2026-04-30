import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as eventService from "../services/event.service";
import { sendServerError } from "./handleError";

export async function EventPassService_get(
  c: Context,
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = c.request.params as { id: string };
    const eventPass = await eventService.getEventById(id);

    if (!eventPass) {
      res.status(404).json({ code: 404, message: "Event pass not found" });
      return;
    }

    res.status(200).json(eventPass);
  } catch (err) {
    sendServerError(res, err);
  }
}
