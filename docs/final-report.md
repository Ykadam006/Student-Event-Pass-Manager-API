# Final Project Report

## Design Decisions
- Kept contract-first REST architecture with OpenAPI as single source of truth.
- Added GraphQL (`/graphql`) without replacing REST for dual-API comparison.
- Introduced service-layer reuse so REST handlers and GraphQL resolvers share business logic.
- Added phase-2 style third-party integrations using mock provider adapters.

## Challenges and Solutions
- **Challenge:** Keeping REST behavior stable during GraphQL integration.
  **Solution:** Introduced `src/app.ts` composition root and preserved existing operationId handlers.
- **Challenge:** Testing in isolated environments without real Supabase credentials.
  **Solution:** Added deterministic `NODE_ENV=test` path in store for integration tests.
- **Challenge:** Avoiding duplicated business logic.
  **Solution:** Centralized validation and rules in `src/services/*`.

## Performance and Optimization
- Added pagination/filtering on GraphQL event query to reduce response size.
- Added indexed relational schema in `supabase/schema_v2.sql` for events/status/date and registration lookups.
- Compared REST and GraphQL payload flexibility in `docs/performance-comparison.md`.

## Security Considerations
- OpenAPI request validation enabled (`validate: true`).
- Input-level service validations for invalid capacity/registration states.
- CORS explicitly configured in server middleware.
- Sensitive credentials kept in environment variables.

## Future Improvements
- Replace mock integrations with real shipping/recommendation providers.
- Add authN/authZ (JWT + role-based access).
- Add DataLoader and cursor-based pagination for GraphQL.
- Add structured cloud monitoring dashboards and alerts.
