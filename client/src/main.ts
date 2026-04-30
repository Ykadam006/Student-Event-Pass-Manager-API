/**
 * Midterm client: all API traffic goes through the generated SDK
 * (@hey-api/openapi-ts → eventPassService* in generated-client/sdk.gen.ts).
 */
import { client } from "@api/client.gen";
import {
  eventPassServiceCapacityInsights,
  eventPassServiceCreate,
  eventPassServiceDelete,
  eventPassServiceGet,
  eventPassServiceList,
  eventPassServiceTracking,
  eventPassServiceUpdate,
  studentServiceRecommendations,
} from "@api/sdk.gen";
import type { EventPassCreate, EventPassUpdate } from "@api/types.gen";

const overrideBase = import.meta.env.VITE_API_BASE_URL?.trim();
if (overrideBase) {
  client.setConfig({ baseUrl: overrideBase });
}

const cfg = client.getConfig();
const activeBaseUrl =
  typeof cfg.baseUrl === "string" ? cfg.baseUrl.replace(/\/$/, "") : String(cfg.baseUrl ?? "");

const outputEl = document.getElementById("output")!;
const outputTag = document.getElementById("output-tag")!;
const connStatus = document.getElementById("conn-status")!;
const apiBaseEl = document.getElementById("api-base")!;
const linkDocs = document.getElementById("link-docs") as HTMLAnchorElement;
const graphqlQueryEl = document.getElementById("graphql-query") as HTMLTextAreaElement;
const stepButtons = Array.from(document.querySelectorAll(".step-btn")) as HTMLButtonElement[];
const stepPanels = Array.from(document.querySelectorAll(".step-panel")) as HTMLElement[];
const getIdEl = document.getElementById("get-id") as HTMLInputElement;
const deleteIdEl = document.getElementById("delete-id") as HTMLInputElement;
const trackIdEl = document.getElementById("track-id") as HTMLInputElement;
const updateIdEl = document.querySelector('input[name="id"]') as HTMLInputElement;

apiBaseEl.textContent = activeBaseUrl || "(no baseUrl)";
linkDocs.href = `${activeBaseUrl}/docs`;

function showStep(step: string): void {
  for (const button of stepButtons) {
    button.classList.toggle("is-active", button.dataset.stepTarget === step);
  }
  for (const panel of stepPanels) {
    panel.classList.toggle("is-active", panel.dataset.stepPanel === step);
  }
}

for (const button of stepButtons) {
  button.addEventListener("click", () => {
    const step = button.dataset.stepTarget;
    if (!step) return;
    showStep(step);
  });
}

function setLoading(on: boolean): void {
  document.body.classList.toggle("is-loading", on);
}

function setOutputTag(kind: "idle" | "busy" | "ok" | "err", text: string): void {
  outputTag.dataset.kind = kind;
  outputTag.textContent = text;
}

function setConnState(state: "idle" | "busy" | "ok" | "err", text: string): void {
  connStatus.dataset.state = state;
  connStatus.textContent = text;
}

function showResult(title: string, body: unknown, ok: boolean): void {
  outputEl.textContent = `${title}\n${JSON.stringify(body, null, 2)}`;
  setOutputTag(ok ? "ok" : "err", ok ? "Success" : "Error");
}

function collectEventIds(payload: unknown): string[] {
  const found = new Set<string>();
  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    const obj = node as Record<string, unknown>;
    if (typeof obj.id === "string" && (obj.id.startsWith("evt_") || obj.id.length > 0)) {
      found.add(obj.id);
    }
    for (const value of Object.values(obj)) walk(value);
  };
  walk(payload);
  return Array.from(found);
}

function autoFillEventIdsFromPayload(payload: unknown): void {
  const ids = collectEventIds(payload);
  if (ids.length === 0) return;
  const latest = ids[0];
  getIdEl.value = latest;
  deleteIdEl.value = latest;
  trackIdEl.value = latest;
  updateIdEl.value = latest;
}

async function runSdkOp(
  label: string,
  fn: () => Promise<{ error?: unknown; data?: unknown } | Record<string, unknown>>
): Promise<void> {
  setLoading(true);
  setOutputTag("busy", "Loading…");
  try {
    const res = await fn();
    if ("error" in res && res.error !== undefined) {
      showResult(`${label} — error`, res.error, false);
      return;
    }
    const data = "data" in res ? (res as { data: unknown }).data : res;
    showResult(`${label} — data`, data, true);
    autoFillEventIdsFromPayload(data);
  } catch (e) {
    showResult(`${label} — exception`, e instanceof Error ? e.message : String(e), false);
  } finally {
    setLoading(false);
  }
}

async function runGraphQLOp(label: string, query: string): Promise<void> {
  const gqlUrl = `${activeBaseUrl}/graphql`;
  setLoading(true);
  setOutputTag("busy", "Loading…");
  try {
    const response = await fetch(gqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const payload = await response.json();
    const ok = response.ok && !payload.errors;
    showResult(`${label} — ${ok ? "data" : "error"}`, payload, ok);
    if (ok) autoFillEventIdsFromPayload(payload);
  } catch (e) {
    showResult(`${label} — exception`, e instanceof Error ? e.message : String(e), false);
  } finally {
    setLoading(false);
  }
}

const gqlPresets = {
  events: `query GetEvents {
  events {
    id
    title
    location
    availableSeats
    status
  }
}`,
  event: `query GetOneEvent {
  event(id: "evt_001") {
    id
    title
    location
    capacity
    availableSeats
    status
  }
}`,
  insights: `query CapacityInsights {
  capacityInsights {
    totalEvents
    totalCapacity
    totalRegistered
    totalAvailableSeats
    averageFillRate
    fullEvents
  }
}`,
  create: `mutation CreateEvent {
  createEvent(
    input: {
      title: "GraphQL Demo Event"
      location: "Illinois Tech"
      eventDate: "2026-06-15"
      capacity: 40
    }
  ) {
    id
    title
    capacity
    status
    availableSeats
  }
}`,
  update: `mutation UpdateEvent {
  updateEvent(id: "evt_001", input: { location: "Kaplan Hall", capacity: 75 }) {
    id
    title
    location
    capacity
    status
  }
}`,
  remove: `mutation DeleteEvent {
  deleteEvent(id: "evt_001") {
    success
    message
  }
}`,
  students: `query Students {
  students {
    id
    name
    email
    major
  }
}`,
};

document.getElementById("btn-ping")!.addEventListener("click", async () => {
  setConnState("busy", "Testing…");
  setLoading(true);
  try {
    const res = await eventPassServiceList();
    if ("error" in res && res.error !== undefined) {
      setConnState("err", "Unreachable or error");
      showResult("Connection test — error", res.error, false);
      return;
    }
    const data = (res as { data: unknown }).data;
    const n = Array.isArray(data) ? data.length : "?";
    setConnState("ok", `Live · ${n} records visible`);
    showResult("Connection test — list()", data, true);
  } catch (e) {
    setConnState("err", "Failed");
    showResult("Connection test", e instanceof Error ? e.message : String(e), false);
  } finally {
    setLoading(false);
  }
});

document.getElementById("btn-list")!.addEventListener("click", () => {
  void runSdkOp("List passes", () => eventPassServiceList());
});

document.getElementById("btn-get")!.addEventListener("click", () => {
  const id = (document.getElementById("get-id") as HTMLInputElement).value.trim();
  if (!id) {
    showResult("Get pass", "Enter a pass id first.", false);
    return;
  }
  void runSdkOp("Get pass by ID", () => eventPassServiceGet({ path: { id } }));
});

document.getElementById("btn-insights")!.addEventListener("click", () => {
  void runSdkOp("Capacity insights", () => eventPassServiceCapacityInsights());
});

document.getElementById("form-create")!.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const fd = new FormData(form);
  const body: EventPassCreate = {
    eventName: String(fd.get("eventName")),
    category: fd.get("category") as EventPassCreate["category"],
    venue: String(fd.get("venue")),
    eventDate: String(fd.get("eventDate")),
    capacity: Number(fd.get("capacity")),
    registeredCount: Number(fd.get("registeredCount")),
    passType: fd.get("passType") as EventPassCreate["passType"],
  };

  await runSdkOp("Create pass", () => eventPassServiceCreate({ body }));
});

document.getElementById("form-update")!.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const fd = new FormData(form);
  const id = String(fd.get("id") ?? "").trim();
  if (!id) {
    showResult("Update pass", "Enter pass id to update.", false);
    return;
  }

  const patch: EventPassUpdate = {};
  const eventName = String(fd.get("eventName") ?? "").trim();
  const venue = String(fd.get("venue") ?? "").trim();
  const eventDate = String(fd.get("eventDate") ?? "").trim();
  const category = String(fd.get("category") ?? "").trim();
  const capacity = String(fd.get("capacity") ?? "").trim();
  const registeredCount = String(fd.get("registeredCount") ?? "").trim();
  const passType = String(fd.get("passType") ?? "").trim();

  if (eventName) patch.eventName = eventName;
  if (venue) patch.venue = venue;
  if (eventDate) patch.eventDate = eventDate;
  if (category) patch.category = category as EventPassUpdate["category"];
  if (capacity) patch.capacity = Number(capacity);
  if (registeredCount) patch.registeredCount = Number(registeredCount);
  if (passType) patch.passType = passType as EventPassUpdate["passType"];

  await runSdkOp("Update pass", () => eventPassServiceUpdate({ path: { id }, body: patch }));
});

document.getElementById("btn-delete")!.addEventListener("click", () => {
  const id = (document.getElementById("delete-id") as HTMLInputElement).value.trim();
  if (!id) {
    showResult("Delete", "Enter a pass id first.", false);
    return;
  }
  void runSdkOp("Delete pass", () => eventPassServiceDelete({ path: { id } }));
});

document.getElementById("btn-track")!.addEventListener("click", () => {
  const id = (document.getElementById("track-id") as HTMLInputElement).value.trim();
  if (!id) {
    showResult("Tracking", "Enter a pass id first.", false);
    return;
  }
  void runSdkOp("Get tracking", () => eventPassServiceTracking({ path: { id } }));
});

document.getElementById("btn-recommend")!.addEventListener("click", () => {
  const studentId = (document.getElementById("recommend-student-id") as HTMLInputElement).value.trim();
  if (!studentId) {
    showResult("Recommendations", "Enter a student id first.", false);
    return;
  }
  void runSdkOp("Get recommendations", () =>
    studentServiceRecommendations({ path: { studentId } })
  );
});

document.getElementById("btn-gql-events")!.addEventListener("click", () => {
  graphqlQueryEl.value = gqlPresets.events;
});

document.getElementById("btn-gql-insights")!.addEventListener("click", () => {
  graphqlQueryEl.value = gqlPresets.insights;
});

document.getElementById("btn-gql-create")!.addEventListener("click", () => {
  graphqlQueryEl.value = gqlPresets.create;
});

document.getElementById("btn-gql-event")!.addEventListener("click", () => {
  graphqlQueryEl.value = gqlPresets.event;
});

document.getElementById("btn-gql-update")!.addEventListener("click", () => {
  graphqlQueryEl.value = gqlPresets.update;
});

document.getElementById("btn-gql-delete")!.addEventListener("click", () => {
  graphqlQueryEl.value = gqlPresets.remove;
});

document.getElementById("btn-gql-students")!.addEventListener("click", () => {
  graphqlQueryEl.value = gqlPresets.students;
});

document.getElementById("btn-gql-run")!.addEventListener("click", () => {
  const query = graphqlQueryEl.value.trim();
  if (!query) {
    showResult("GraphQL", "Enter a query or mutation first.", false);
    return;
  }
  void runGraphQLOp("GraphQL /graphql", query);
});
