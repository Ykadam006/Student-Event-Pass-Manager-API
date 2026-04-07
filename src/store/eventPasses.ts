import { getSupabase } from "../lib/supabase";
import {
  CapacityInsights,
  EventPass,
  EventPassCreate,
  EventPassUpdate,
  EventCategory,
  PassType,
} from "../types/eventPass";

type EventPassRow = {
  id: string;
  event_name: string;
  category: string;
  venue: string;
  event_date: string;
  capacity: number;
  registered_count: number;
  pass_type: string;
};

function rowToEventPass(row: EventPassRow): EventPass {
  return {
    id: row.id,
    eventName: row.event_name,
    category: row.category as EventCategory,
    venue: row.venue,
    eventDate: row.event_date.slice(0, 10),
    capacity: row.capacity,
    registeredCount: row.registered_count,
    passType: row.pass_type as PassType,
  };
}

function generateId(): string {
  return `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export async function findAll(): Promise<EventPass[]> {
  const { data, error } = await getSupabase()
    .from("event_passes")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;
  return (data as EventPassRow[] | null)?.map(rowToEventPass) ?? [];
}

export async function findById(id: string): Promise<EventPass | undefined> {
  const { data, error } = await getSupabase()
    .from("event_passes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;
  return rowToEventPass(data as EventPassRow);
}

export async function create(body: EventPassCreate): Promise<EventPass> {
  const id = generateId();
  const row = {
    id,
    event_name: body.eventName,
    category: body.category,
    venue: body.venue,
    event_date: body.eventDate,
    capacity: body.capacity,
    registered_count: body.registeredCount,
    pass_type: body.passType,
  };

  const { data, error } = await getSupabase()
    .from("event_passes")
    .insert(row)
    .select("*")
    .single();

  if (error) throw error;
  return rowToEventPass(data as EventPassRow);
}

export async function update(
  id: string,
  body: EventPassUpdate
): Promise<EventPass | undefined> {
  const patch: Partial<EventPassRow> = {};
  if (body.eventName !== undefined) patch.event_name = body.eventName;
  if (body.category !== undefined) patch.category = body.category;
  if (body.venue !== undefined) patch.venue = body.venue;
  if (body.eventDate !== undefined) patch.event_date = body.eventDate;
  if (body.capacity !== undefined) patch.capacity = body.capacity;
  if (body.registeredCount !== undefined) patch.registered_count = body.registeredCount;
  if (body.passType !== undefined) patch.pass_type = body.passType;

  if (Object.keys(patch).length === 0) {
    return findById(id);
  }

  const { data, error } = await getSupabase()
    .from("event_passes")
    .update(patch)
    .eq("id", id)
    .select("*");

  if (error) throw error;
  if (!data?.length) return undefined;
  return rowToEventPass(data[0] as EventPassRow);
}

export async function remove(id: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from("event_passes")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

function computeCapacityInsights(rows: EventPass[]): CapacityInsights {
  const totalEvents = rows.length;

  const soldOutEvents = rows.filter((ep) => ep.registeredCount >= ep.capacity).length;

  const nearlyFullEvents = rows.filter(
    (ep) => ep.registeredCount / ep.capacity >= 0.8
  ).length;

  const averageFillRate =
    totalEvents === 0
      ? 0
      : Number(
          (
            rows.reduce((sum, ep) => sum + ep.registeredCount / ep.capacity, 0) /
            totalEvents
          ).toFixed(2)
        );

  const urgentEvents = rows
    .filter((ep) => ep.registeredCount / ep.capacity >= 0.8)
    .map((ep) => ({
      id: ep.id,
      eventName: ep.eventName,
      fillRate: Number((ep.registeredCount / ep.capacity).toFixed(2)),
    }));

  const categoryMap = new Map<string, number>();
  for (const ep of rows) {
    categoryMap.set(ep.category, (categoryMap.get(ep.category) ?? 0) + 1);
  }

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count,
  }));

  return {
    totalEvents,
    soldOutEvents,
    nearlyFullEvents,
    averageFillRate,
    urgentEvents,
    categoryBreakdown,
  };
}

export async function getCapacityInsights(): Promise<CapacityInsights> {
  const rows = await findAll();
  return computeCapacityInsights(rows);
}
