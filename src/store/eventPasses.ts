import {
  CapacityInsights,
  EventPass,
  EventPassCreate,
  EventPassUpdate,
} from "../types/eventPass";

const eventPasses: EventPass[] = [
  {
    id: "evt_001",
    eventName: "Scarlet Hacks Kickoff",
    category: "Hackathon",
    venue: "Downtown Campus Room 470",
    eventDate: "2026-04-04",
    capacity: 300,
    registeredCount: 275,
    passType: "Free",
  },
  {
    id: "evt_002",
    eventName: "Frontend Bootcamp",
    category: "Workshop",
    venue: "Tech Lab A",
    eventDate: "2026-04-12",
    capacity: 60,
    registeredCount: 60,
    passType: "Standard",
  },
  {
    id: "evt_003",
    eventName: "AI Research Seminar",
    category: "Seminar",
    venue: "Engineering Hall 201",
    eventDate: "2026-04-20",
    capacity: 120,
    registeredCount: 70,
    passType: "Free",
  },
  {
    id: "evt_004",
    eventName: "Startup Networking Night",
    category: "Networking",
    venue: "Innovation Center",
    eventDate: "2026-04-25",
    capacity: 90,
    registeredCount: 78,
    passType: "VIP",
  },
  {
    id: "evt_005",
    eventName: "Spring Career Fair",
    category: "CareerFair",
    venue: "Main Auditorium",
    eventDate: "2026-05-01",
    capacity: 500,
    registeredCount: 410,
    passType: "Standard",
  },
];

function generateId(): string {
  return `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export function findAll(): EventPass[] {
  return eventPasses;
}

export function findById(id: string): EventPass | undefined {
  return eventPasses.find((ep) => ep.id === id);
}

export function create(body: EventPassCreate): EventPass {
  const newEventPass: EventPass = {
    id: generateId(),
    ...body,
  };
  eventPasses.push(newEventPass);
  return newEventPass;
}

export function update(id: string, body: EventPassUpdate): EventPass | undefined {
  const index = eventPasses.findIndex((ep) => ep.id === id);
  if (index === -1) return undefined;
  eventPasses[index] = { ...eventPasses[index], ...body };
  return eventPasses[index];
}

export function remove(id: string): boolean {
  const index = eventPasses.findIndex((ep) => ep.id === id);
  if (index === -1) return false;
  eventPasses.splice(index, 1);
  return true;
}

export function getCapacityInsights(): CapacityInsights {
  const totalEvents = eventPasses.length;

  const soldOutEvents = eventPasses.filter(
    (ep) => ep.registeredCount >= ep.capacity
  ).length;

  const nearlyFullEvents = eventPasses.filter(
    (ep) => ep.registeredCount / ep.capacity >= 0.8
  ).length;

  const averageFillRate =
    totalEvents === 0
      ? 0
      : Number(
          (
            eventPasses.reduce(
              (sum, ep) => sum + ep.registeredCount / ep.capacity,
              0
            ) / totalEvents
          ).toFixed(2)
        );

  const urgentEvents = eventPasses
    .filter((ep) => ep.registeredCount / ep.capacity >= 0.8)
    .map((ep) => ({
      id: ep.id,
      eventName: ep.eventName,
      fillRate: Number((ep.registeredCount / ep.capacity).toFixed(2)),
    }));

  const categoryMap = new Map<string, number>();
  for (const ep of eventPasses) {
    categoryMap.set(ep.category, (categoryMap.get(ep.category) ?? 0) + 1);
  }

  const categoryBreakdown = Array.from(categoryMap.entries()).map(
    ([category, count]) => ({ category, count })
  );

  return {
    totalEvents,
    soldOutEvents,
    nearlyFullEvents,
    averageFillRate,
    urgentEvents,
    categoryBreakdown,
  };
}
