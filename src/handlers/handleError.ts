import { Response } from "express";

export function sendServerError(res: Response, err: unknown): void {
  console.error(err);
  res.status(500).json({ code: 500, message: "Internal Server Error" });
}
