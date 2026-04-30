import { registrationsData, RegistrationRecord } from "../data/registrations.data";
import { getEventById, updateEvent } from "./event.service";
import { getStudentById } from "./student.service";

function generateRegistrationId(): string {
  return `reg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export async function listRegistrations(): Promise<RegistrationRecord[]> {
  return registrationsData;
}

export async function listRegistrationsByEventId(eventId: string): Promise<RegistrationRecord[]> {
  return registrationsData.filter((registration) => registration.eventId === eventId);
}

export async function listRegistrationsByStudentId(studentId: string): Promise<RegistrationRecord[]> {
  return registrationsData.filter((registration) => registration.studentId === studentId);
}

export async function getRegistrationById(id: string): Promise<RegistrationRecord | undefined> {
  return registrationsData.find((registration) => registration.id === id);
}

export async function registerStudent(eventId: string, studentId: string): Promise<RegistrationRecord> {
  const event = await getEventById(eventId);
  if (!event) throw new Error("Event ID not found");
  const student = await getStudentById(studentId);
  if (!student) throw new Error("Student ID not found");
  if (event.registeredCount >= event.capacity) throw new Error("Cannot register for FULL event");

  const existing = registrationsData.find(
    (registration) =>
      registration.eventId === eventId &&
      registration.studentId === studentId &&
      registration.status === "REGISTERED"
  );
  if (existing) throw new Error("Student already registered for this event");

  const created: RegistrationRecord = {
    id: generateRegistrationId(),
    eventId,
    studentId,
    status: "REGISTERED",
    createdAt: new Date().toISOString(),
  };
  registrationsData.push(created);

  await updateEvent(eventId, { registeredCount: event.registeredCount + 1 });
  return created;
}

export async function cancelRegistration(registrationId: string): Promise<RegistrationRecord> {
  const registration = registrationsData.find((r) => r.id === registrationId);
  if (!registration) throw new Error("Registration ID not found");
  if (registration.status === "CANCELLED") throw new Error("Registration is already cancelled");

  const event = await getEventById(registration.eventId);
  if (!event) throw new Error("Event ID not found");

  registration.status = "CANCELLED";
  if (event.registeredCount > 0) {
    await updateEvent(registration.eventId, { registeredCount: event.registeredCount - 1 });
  }
  return registration;
}
