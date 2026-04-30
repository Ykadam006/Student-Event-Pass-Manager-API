import * as store from "../store/eventPasses";

export type GraphQLCapacityInsight = {
  totalEvents: number;
  totalCapacity: number;
  totalRegistered: number;
  totalAvailableSeats: number;
  averageFillRate: number;
  fullEvents: number;
};

export async function getCapacityInsights(): Promise<GraphQLCapacityInsight> {
  const events = await store.findAll();
  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const totalRegistered = events.reduce((sum, event) => sum + event.registeredCount, 0);
  const totalAvailableSeats = Math.max(0, totalCapacity - totalRegistered);
  const averageFillRate = totalCapacity === 0 ? 0 : Number((totalRegistered / totalCapacity).toFixed(2));
  const fullEvents = events.filter((event) => event.registeredCount >= event.capacity).length;

  return {
    totalEvents,
    totalCapacity,
    totalRegistered,
    totalAvailableSeats,
    averageFillRate,
    fullEvents,
  };
}
