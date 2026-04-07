import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as store from "../store/eventPasses";
import { sendServerError } from "./handleError";

export async function EventPassService_list(
  _c: Context,
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const rows = await store.findAll();
    res.status(200).json(rows);
  } catch (err) {
    sendServerError(res, err);
  }
}
