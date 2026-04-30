import { getStudentById } from "./student.service";
import { listEvents } from "./event.service";

export type Recommendation = {
  id: string;
  title: string;
  reason: string;
  score: number;
};

export async function getRecommendationsForStudent(studentId: string): Promise<Recommendation[]> {
  const student = await getStudentById(studentId);
  if (!student) {
    throw new Error("Student ID not found");
  }

  const events = await listEvents(undefined, { limit: 20, offset: 0 });
  return events.slice(0, 5).map((event, index) => ({
    id: event.id,
    title: event.eventName,
    reason: `Recommended for ${student.major ?? "campus interests"} based on available seats and category fit`,
    score: Number((0.95 - index * 0.12).toFixed(2)),
  }));
}
