# Architecture

- REST handlers (`src/handlers`) and GraphQL resolvers (`src/graphql/resolvers.ts`) both call the same service layer (`src/services`).
- Service layer wraps validation, business rules, and store/data access.
- Event data persists in Supabase through `src/store/eventPasses.ts`.
- GraphQL registration/student data is in-memory (`src/data`) and registration mutations update event counts through `event.service`.

## Layering

1. Transport layer: Express routes (OpenAPI + `/graphql`)
2. Application layer: services (`event`, `registration`, `student`, `insight`)
3. Data layer: Supabase store + in-memory relationship data
