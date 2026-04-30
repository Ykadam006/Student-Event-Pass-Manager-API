import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app";

process.env.NODE_ENV = "test";

test("REST: GET /openapi.json works", async () => {
  const app = await createApp();
  const response = await request(app).get("/openapi.json");
  assert.equal(response.status, 200);
  assert.equal(response.body.openapi, "3.1.0");
});

test("REST: GET / returns event list", async () => {
  const app = await createApp();
  const response = await request(app).get("/");
  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);
  assert.equal(response.body[0].eventName, "Backend Workshop");
});

test("REST: GET /{id}/tracking returns third-party tracking data", async () => {
  const app = await createApp();
  const response = await request(app).get("/evt_seed_1/tracking");
  assert.equal(response.status, 200);
  assert.equal(response.body.eventId, "evt_seed_1");
  assert.equal(typeof response.body.trackingId, "string");
});

test("REST: GET /students/{studentId}/recommendations returns recommendations", async () => {
  const app = await createApp();
  const response = await request(app).get("/students/stu_1/recommendations");
  assert.equal(response.status, 200);
  assert.equal(response.body.studentId, "stu_1");
  assert.equal(Array.isArray(response.body.recommendations), true);
});
