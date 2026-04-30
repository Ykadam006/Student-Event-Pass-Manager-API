import { getEventById } from "./event.service";

type TrackingStatus = "CREATED" | "SCHEDULED" | "IN_TRANSIT" | "DELIVERED" | "DELAYED";

export type TrackingInfo = {
  eventId: string;
  provider: string;
  trackingId: string;
  status: TrackingStatus;
  estimatedArrival: string;
  lastUpdated: string;
};

const statusCycle: TrackingStatus[] = ["CREATED", "SCHEDULED", "IN_TRANSIT", "DELIVERED"];

export async function getEventTracking(eventId: string): Promise<TrackingInfo> {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error("Event ID not found");
  }

  const seed = eventId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const status = statusCycle[seed % statusCycle.length];
  const etaDate = new Date(`${event.eventDate}T12:00:00.000Z`);
  etaDate.setDate(etaDate.getDate() - 2);

  return {
    eventId,
    provider: "MockShip API",
    trackingId: `trk_${eventId}`,
    status,
    estimatedArrival: etaDate.toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}
