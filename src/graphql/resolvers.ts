import { GraphQLError } from "graphql";
import * as eventService from "../services/event.service";
import * as insightService from "../services/insight.service";
import * as registrationService from "../services/registration.service";
import * as studentService from "../services/student.service";
import { EventPass, EventPassCreate, EventPassUpdate } from "../types/eventPass";

type ResolverEvent = EventPass & { status: eventService.EventStatus };

function toResolverEvent(event: EventPass): ResolverEvent {
  return {
    ...event,
    status: eventService.getEventStatus(event),
  };
}

function mapEventInput(input: {
  title: string;
  description?: string | null;
  location: string;
  eventDate: string;
  capacity: number;
}): EventPassCreate {
  return {
    eventName: input.title,
    category: "Workshop",
    venue: input.location,
    eventDate: input.eventDate,
    capacity: input.capacity,
    registeredCount: 0,
    passType: "Standard",
  };
}

function mapEventPatchInput(input: {
  title?: string | null;
  description?: string | null;
  location?: string | null;
  eventDate?: string | null;
  capacity?: number | null;
}): EventPassUpdate {
  return {
    eventName: input.title ?? undefined,
    venue: input.location ?? undefined,
    eventDate: input.eventDate ?? undefined,
    capacity: input.capacity ?? undefined,
  };
}

function toGraphQLError(error: unknown): GraphQLError {
  const message = error instanceof Error ? error.message : "Unknown server error";
  const badRequestMessages = [
    "required",
    "cannot",
    "must",
    "already",
    "invalid",
    "not found",
    "missing",
  ];
  const code = badRequestMessages.some((part) => message.toLowerCase().includes(part))
    ? "BAD_USER_INPUT"
    : "INTERNAL_SERVER_ERROR";
  return new GraphQLError(message, { extensions: { code } });
}

export const resolvers = {
  Query: {
    events: async (
      _: unknown,
      args: { filter?: eventService.EventFilter; pagination?: eventService.Pagination }
    ): Promise<ResolverEvent[]> => {
      try {
        const events = await eventService.listEvents(args.filter, args.pagination);
        return events.map(toResolverEvent);
      } catch (error) {
        throw toGraphQLError(error);
      }
    },
    event: async (_: unknown, args: { id: string }): Promise<ResolverEvent | null> => {
      try {
        const event = await eventService.getEventById(args.id);
        return event ? toResolverEvent(event) : null;
      } catch (error) {
        throw toGraphQLError(error);
      }
    },
    students: async () => studentService.listStudents(),
    student: async (_: unknown, args: { id: string }) => studentService.getStudentById(args.id),
    capacityInsights: async () => insightService.getCapacityInsights(),
  },
  Mutation: {
    createEvent: async (_: unknown, args: { input: any }): Promise<ResolverEvent> => {
      try {
        const event = await eventService.createEvent(mapEventInput(args.input));
        return toResolverEvent(event);
      } catch (error) {
        throw toGraphQLError(error);
      }
    },
    updateEvent: async (_: unknown, args: { id: string; input: any }): Promise<ResolverEvent> => {
      try {
        const event = await eventService.updateEvent(args.id, mapEventPatchInput(args.input));
        return toResolverEvent(event);
      } catch (error) {
        throw toGraphQLError(error);
      }
    },
    deleteEvent: async (
      _: unknown,
      args: { id: string }
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const deleted = await eventService.deleteEvent(args.id);
        if (!deleted) throw new Error("Event ID not found");
        return { success: true, message: "Event deleted successfully" };
      } catch (error) {
        throw toGraphQLError(error);
      }
    },
    registerStudent: async (
      _: unknown,
      args: { eventId: string; studentId: string }
    ) => {
      try {
        return await registrationService.registerStudent(args.eventId, args.studentId);
      } catch (error) {
        throw toGraphQLError(error);
      }
    },
    cancelRegistration: async (_: unknown, args: { registrationId: string }) => {
      try {
        return await registrationService.cancelRegistration(args.registrationId);
      } catch (error) {
        throw toGraphQLError(error);
      }
    },
  },
  Event: {
    title: (event: ResolverEvent) => event.eventName,
    description: () => null,
    location: (event: ResolverEvent) => event.venue,
    availableSeats: (event: ResolverEvent) => Math.max(0, event.capacity - event.registeredCount),
    registrations: async (event: ResolverEvent) => registrationService.listRegistrationsByEventId(event.id),
  },
  Student: {
    registrations: async (student: { id: string }) =>
      registrationService.listRegistrationsByStudentId(student.id),
  },
  Registration: {
    student: async (registration: { studentId: string }) => {
      const student = await studentService.getStudentById(registration.studentId);
      if (!student) throw new Error("Student ID not found");
      return student;
    },
    event: async (registration: { eventId: string }) => {
      const event = await eventService.getEventById(registration.eventId);
      if (!event) throw new Error("Event ID not found");
      return toResolverEvent(event);
    },
  },
};
