import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app";

process.env.NODE_ENV = "test";

test("GraphQL: query events with filtering/pagination", async () => {
  const app = await createApp();

  const response = await request(app)
    .post("/graphql")
    .send({
      query: `
        query {
          events(filter: { search: "backend" }, pagination: { limit: 5, offset: 0 }) {
            id
            title
            location
            availableSeats
            status
          }
        }
      `,
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.events.length, 1);
  assert.equal(response.body.data.events[0].title, "Backend Workshop");
  assert.equal(response.body.data.events[0].availableSeats, 30);
});

test("GraphQL: create/update/delete event mutation flow", async () => {
  const app = await createApp();

  const createResponse = await request(app)
    .post("/graphql")
    .send({
      query: `
      mutation {
        createEvent(input: {
          title: "API Design Session"
          location: "Main Campus"
          eventDate: "2026-06-01"
          capacity: 60
        }) {
          id
          title
          capacity
        }
      }`,
    });

  assert.equal(createResponse.status, 200);
  assert.equal(createResponse.body.data.createEvent.title, "API Design Session");

  const updateResponse = await request(app)
    .post("/graphql")
    .send({
      query: `
      mutation {
        updateEvent(id: "evt_seed_1", input: { capacity: 75, location: "Tech Park" }) {
          id
          capacity
          location
        }
      }`,
    });
  assert.equal(updateResponse.status, 200);
  assert.equal(updateResponse.body.data.updateEvent.capacity, 75);

  const deleteResponse = await request(app)
    .post("/graphql")
    .send({
      query: `
      mutation {
        deleteEvent(id: "evt_seed_1") {
          success
          message
        }
      }`,
    });
  assert.equal(deleteResponse.status, 200);
  assert.equal(deleteResponse.body.data.deleteEvent.success, true);
});

test("GraphQL: invalid event id returns error", async () => {
  const app = await createApp();

  const response = await request(app)
    .post("/graphql")
    .send({
      query: `
      mutation {
        updateEvent(id: "evt_missing", input: { capacity: 22 }) {
          id
        }
      }`,
    });

  assert.equal(response.status, 200);
  assert.equal(Boolean(response.body.errors), true);
  assert.match(response.body.errors[0].message, /not found/i);
});
