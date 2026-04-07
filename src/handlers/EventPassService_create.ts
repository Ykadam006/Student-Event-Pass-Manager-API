import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as store from "../store/eventPasses";
import { EventPassCreate } from "../types/eventPass";
import { sendServerError } from "./handleError";

export async function EventPassService_create(
  c: Context,
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const body = c.request.requestBody as EventPassCreate;
    const created = await store.create(body);
    res.status(201).json(created);
  } catch (err) {
    sendServerError(res, err);
  }
}
