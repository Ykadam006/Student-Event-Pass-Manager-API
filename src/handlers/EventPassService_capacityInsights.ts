import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as store from "../store/eventPasses";
import { sendServerError } from "./handleError";

export async function EventPassService_capacityInsights(
  _c: Context,
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const insights = await store.getCapacityInsights();
    res.status(200).json(insights);
  } catch (err) {
    sendServerError(res, err);
  }
}
