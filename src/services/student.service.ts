import { studentsData, StudentRecord } from "../data/students.data";

export async function listStudents(): Promise<StudentRecord[]> {
  return studentsData;
}

export async function getStudentById(id: string): Promise<StudentRecord | undefined> {
  return studentsData.find((student) => student.id === id);
}
