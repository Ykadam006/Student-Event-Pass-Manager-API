import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as eventService from "../services/event.service";
import { EventPassCreate } from "../types/eventPass";
import { sendServerError } from "./handleError";

export async function EventPassService_create(
  c: Context,
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const body = c.request.requestBody as EventPassCreate;
    const created = await eventService.createEvent(body);
    res.status(201).json(created);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    if (message.includes("must") || message.includes("cannot") || message.includes("required")) {
      res.status(400).json({ code: 400, message });
      return;
    }
    sendServerError(res, err);
  }
}
