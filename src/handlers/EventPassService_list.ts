import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as eventService from "../services/event.service";
import { sendServerError } from "./handleError";

export async function EventPassService_list(
  _c: Context,
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const rows = await eventService.listEvents(undefined, { limit: 1000, offset: 0 });
    res.status(200).json(rows);
  } catch (err) {
    sendServerError(res, err);
  }
}
