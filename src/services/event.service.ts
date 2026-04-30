import * as store from "../store/eventPasses";
import { EventPass, EventPassCreate, EventPassUpdate } from "../types/eventPass";

export type EventStatus = "UPCOMING" | "FULL" | "CANCELLED" | "COMPLETED";

export type EventFilter = {
  status?: EventStatus;
  search?: string;
  location?: string;
};

export type Pagination = {
  limit?: number;
  offset?: number;
};

export function getEventStatus(event: EventPass): EventStatus {
  if (event.registeredCount >= event.capacity) return "FULL";
  return "UPCOMING";
}

export function toGraphQLEvent(event: EventPass): EventPass & { status: EventStatus } {
  return { ...event, status: getEventStatus(event) };
}

export async function listEvents(filter?: EventFilter, pagination?: Pagination): Promise<EventPass[]> {
  const rows = await store.findAll();

  const filtered = rows.filter((event) => {
    const statusOk = filter?.status ? getEventStatus(event) === filter.status : true;
    const searchValue = (filter?.search ?? "").trim().toLowerCase();
    const searchOk = searchValue
      ? event.eventName.toLowerCase().includes(searchValue) ||
        event.category.toLowerCase().includes(searchValue) ||
        event.venue.toLowerCase().includes(searchValue)
      : true;
    const locationValue = (filter?.location ?? "").trim().toLowerCase();
    const locationOk = locationValue ? event.venue.toLowerCase().includes(locationValue) : true;
    return statusOk && searchOk && locationOk;
  });

  const limit = Math.max(0, pagination?.limit ?? 10);
  const offset = Math.max(0, pagination?.offset ?? 0);
  return filtered.slice(offset, offset + limit);
}

export async function getEventById(id: string): Promise<EventPass | undefined> {
  return store.findById(id);
}

function validateCreateInput(input: EventPassCreate): void {
  if (!input.eventName?.trim()) throw new Error("Event title is required");
  if (input.capacity <= 0) throw new Error("Capacity must be greater than 0");
  if (input.registeredCount < 0) throw new Error("Registered count cannot be negative");
  if (input.registeredCount > input.capacity) {
    throw new Error("Registered count cannot exceed capacity");
  }
}

function validateUpdateInput(existing: EventPass, input: EventPassUpdate): void {
  const nextCapacity = input.capacity ?? existing.capacity;
  const nextRegistered = input.registeredCount ?? existing.registeredCount;
  if (nextCapacity <= 0) throw new Error("Capacity must be greater than 0");
  if (nextRegistered < 0) throw new Error("Registered count cannot be negative");
  if (nextRegistered > nextCapacity) throw new Error("Registered count cannot exceed capacity");
}

export async function createEvent(input: EventPassCreate): Promise<EventPass> {
  validateCreateInput(input);
  return store.create(input);
}

export async function updateEvent(id: string, input: EventPassUpdate): Promise<EventPass> {
  const existing = await store.findById(id);
  if (!existing) throw new Error("Event ID not found");
  validateUpdateInput(existing, input);
  const updated = await store.update(id, input);
  if (!updated) throw new Error("Event ID not found");
  return updated;
}

export async function deleteEvent(id: string): Promise<boolean> {
  return store.remove(id);
}
