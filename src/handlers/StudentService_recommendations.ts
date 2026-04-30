import { Context } from "openapi-backend";
import { Request, Response } from "express";
import { sendServerError } from "./handleError";
import { getRecommendationsForStudent } from "../services/recommendation.service";

export async function StudentService_recommendations(
  c: Context,
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const { studentId } = c.request.params as { studentId: string };
    const recommendations = await getRecommendationsForStudent(studentId);
    res.status(200).json({
      studentId,
      source: "Mock Recommendation API",
      recommendations,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    if (message.includes("not found")) {
      res.status(404).json({ code: 404, message });
      return;
    }
    sendServerError(res, err);
  }
}
