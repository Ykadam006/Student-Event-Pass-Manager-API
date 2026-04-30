# GraphQL Examples

Endpoint: `POST /graphql`

## Get events

```graphql
query GetEvents {
  events {
    id
    title
    location
    eventDate
    capacity
    registeredCount
    availableSeats
    status
  }
}
```

## Filter + pagination

```graphql
query FilterEvents {
  events(filter: { status: UPCOMING, search: "backend" }, pagination: { limit: 5, offset: 0 }) {
    id
    title
    location
    availableSeats
    status
  }
}
```

## Capacity insights

```graphql
query CapacityInsights {
  capacityInsights {
    totalEvents
    totalCapacity
    totalRegistered
    totalAvailableSeats
    averageFillRate
    fullEvents
  }
}
```

## Create event

```graphql
mutation CreateEvent {
  createEvent(input: {
    title: "Backend API Workshop"
    location: "Illinois Tech"
    eventDate: "2026-05-10"
    capacity: 50
  }) {
    id
    title
    capacity
    availableSeats
    status
  }
}
```
