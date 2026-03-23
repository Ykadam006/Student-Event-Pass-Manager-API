import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as store from "../store/eventPasses";

export function EventPassService_capacityInsights(
  _c: Context,
  _req: Request,
  res: Response
): void {
  res.status(200).json(store.getCapacityInsights());
}
