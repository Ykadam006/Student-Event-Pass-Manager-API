/**
 * Midterm client: all API traffic goes through the generated SDK
 * (@hey-api/openapi-ts → eventPassService* in generated-client/sdk.gen.ts).
 */
import { client } from "@api/client.gen";
import {
  eventPassServiceCapacityInsights,
  eventPassServiceCreate,
  eventPassServiceDelete,
  eventPassServiceList,
} from "@api/sdk.gen";
import type { EventPassCreate } from "@api/types.gen";

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

apiBaseEl.textContent = activeBaseUrl || "(no baseUrl)";
linkDocs.href = `${activeBaseUrl}/docs`;

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
  } catch (e) {
    showResult(`${label} — exception`, e instanceof Error ? e.message : String(e), false);
  } finally {
    setLoading(false);
  }
}

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

document.getElementById("btn-delete")!.addEventListener("click", () => {
  const id = (document.getElementById("delete-id") as HTMLInputElement).value.trim();
  if (!id) {
    showResult("Delete", "Enter a pass id first.", false);
    return;
  }
  void runSdkOp("Delete pass", () => eventPassServiceDelete({ path: { id } }));
});
