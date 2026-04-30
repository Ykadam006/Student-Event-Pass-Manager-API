export type RegistrationStatus = "REGISTERED" | "CANCELLED";

export type RegistrationRecord = {
  id: string;
  eventId: string;
  studentId: string;
  status: RegistrationStatus;
  createdAt: string;
};

export const registrationsData: RegistrationRecord[] = [];
