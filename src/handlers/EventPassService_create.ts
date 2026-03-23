import { Context } from "openapi-backend";
import { Request, Response } from "express";
import * as store from "../store/eventPasses";
import { EventPassCreate } from "../types/eventPass";

export function EventPassService_create(c: Context, _req: Request, res: Response): void {
  const body = c.request.requestBody as EventPassCreate;
  const created = store.create(body);
  res.status(201).json(created);
}
