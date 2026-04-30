# Advanced Backend Development — Final Submission

## Student and Project Details

- **Student:** Yogesh Kadam
- **Course:** Advanced Backend Development
- **Project Title:** Campus Event Pass Manager API

## Submission Links

- **GitHub Repository:** https://github.com/Ykadam006/Student-Event-Pass-Manager-API
- **Live Backend API:** https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net
- **Swagger/OpenAPI Docs:** https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/docs
- **OpenAPI YAML:** https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/openapi.yaml
- **OpenAPI JSON:** https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/openapi.json
- **GraphQL Endpoint:** https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/graphql
- **Frontend Demo URL:** https://student-event-pass-manager-api.vercel.app/

## Project Summary

I built a multi-layer backend system using TypeScript, Node.js, Express, OpenAPI, Supabase PostgreSQL, Apollo Server GraphQL, and Azure App Service. The backend supports both REST and GraphQL APIs in the same Express application and reuses a shared service layer for business logic. The project includes contract-first REST validation, Swagger documentation, Supabase persistence, third-party-style mock integrations, GraphQL queries and mutations, filtering, pagination, relationships, calculated fields, automated tests, frontend demo support, and CI/CD deployment through GitHub Actions.

## Scope Completed by Phase

### Phase 1 — Basic REST API with Database

- Contract-first REST API implemented with OpenAPI (`openapi.yaml`)
- Supabase PostgreSQL integration for event-pass data
- Core CRUD + custom analytics endpoint implemented
- Cloud deployment configured (Azure App Service)
- CI/CD workflow configured (`.github/workflows/main_student-event-pass-manager-api.yml`)

### Phase 2 — Enhanced REST API with Third-Party Integration

- Added integration endpoint: `GET /{id}/tracking`
  - Provider pattern implemented via `src/services/tracking.service.ts`
  - Mock shipping response with tracking status and ETA
- Added integration endpoint: `GET /students/{studentId}/recommendations`
  - Provider pattern implemented via `src/services/recommendation.service.ts`
  - Mock recommendation response based on student context
- Added structured error responses for invalid IDs and integration failures

### Phase 3 — GraphQL API Implementation

- Added GraphQL endpoint: `POST /graphql`
- Implemented GraphQL schema with:
  - Types (`Event`, `Student`, `Registration`, `CapacityInsight`)
  - Queries and mutations
  - Input types and enums
  - Relationships and calculated fields
- Reused shared service layer for GraphQL and REST
- Implemented validation and error handling in resolvers

## Architecture Overview

The architecture follows a layered backend design:

1. **Transport Layer**
   - REST routes through OpenAPI operation handlers
   - GraphQL endpoint through Apollo middleware
2. **Service Layer**
   - Centralized business logic in `src/services/*`
   - Shared across REST and GraphQL to avoid duplication
3. **Data Layer**
   - Supabase-backed store for persistent event data (`src/store/eventPasses.ts`)
   - In-memory relationship support for GraphQL student/registration joins (`src/data/*`)

Both REST and GraphQL call the same service layer, ensuring consistency and cleaner code reuse.

## Database and Relationship Design

Primary runtime persistence uses Supabase table `event_passes` for core operations.

For normalized relational design evidence, `supabase/schema_v2.sql` includes:

- `students` (PK: `id`)
- `events` (PK: `id`)
- `registrations` (PK: `id`, FK `student_id -> students.id`, FK `event_id -> events.id`)

Relationship model:

- `students` 1-to-many `registrations`
- `events` 1-to-many `registrations`

Indexes are included in `schema_v2.sql` for query optimization (`events` status/date and registration join paths).

## REST API Endpoints Implemented

- `GET /`
- `POST /`
- `GET /{id}`
- `PATCH /{id}`
- `DELETE /{id}`
- `GET /capacity-insights`
- `GET /{id}/tracking`
- `GET /students/{studentId}/recommendations`
- `GET /docs`
- `GET /openapi.yaml`
- `GET /openapi.json`
- `POST /graphql`

## GraphQL Operations Implemented

### Queries

- `events(filter, pagination)`
- `event(id)`
- `students`
- `student(id)`
- `capacityInsights`

### Mutations

- `createEvent(input)`
- `updateEvent(id, input)`
- `deleteEvent(id)`
- `registerStudent(eventId, studentId)`
- `cancelRegistration(registrationId)`

## Advanced Features Included

- GraphQL filtering and pagination
- GraphQL nested relationships (`event -> registrations -> student`)
- Calculated GraphQL fields (`availableSeats`, `status`)
- REST + GraphQL service-layer reuse
- Third-party-style integration layer (mock providers)
- OpenAPI validation and structured error handling

## Testing and Validation

Automated tests are implemented and passing:

- `src/tests/rest.test.ts`
- `src/tests/graphql.test.ts`

Commands:

```bash
npm run build
npm test
npm run client:build
```

## Security Considerations

- Secrets are loaded from environment variables and not hardcoded
- `.env` is not intended for Git commit; `.env.example` is used as template
- OpenAPI request validation is enabled (`validate: true`)
- GraphQL schema + resolver checks enforce input constraints
- Error responses are controlled and do not expose sensitive internals
- CORS headers are configured for frontend/backend communication

Authentication was optional in assignment requirements. This implementation prioritizes validation, safe configuration, and error handling, with auth planned as future scope.
Authentication was optional in assignment requirements. This implementation focuses on strong validation, safe cloud configuration, structured error handling, and secure environment variable practices.

## Performance Comparison (REST vs GraphQL)

- REST uses multiple resource endpoints and fixed response shapes.
- GraphQL uses single endpoint (`/graphql`) and client-selected fields.
- REST is straightforward for standard CRUD and contract-first documentation.
- GraphQL is more flexible for nested data and reducing over-fetching.
- In this project:
  - REST excels for predictable endpoint-driven operations and Swagger demos.
  - GraphQL excels for frontend-driven query flexibility and relationship traversal.

## Challenges and Solutions

- **Challenge:** Adding GraphQL without breaking existing REST routes  
  **Solution:** Introduced a shared app composition (`src/app.ts`) and preserved OpenAPI handlers.

- **Challenge:** Avoiding duplicated logic across REST and GraphQL  
  **Solution:** Centralized validation and business rules in `src/services/*`.

- **Challenge:** Testing without depending on live credentials  
  **Solution:** Added deterministic test mode behavior (`NODE_ENV=test`) for store-backed tests.

## Submission Statement

This submission includes the complete implementation of Phase 1 (REST + database + deployment), Phase 2 (third-party/mock integrations), and Phase 3 (GraphQL) in one integrated system. The repository contains source code, OpenAPI contract, GraphQL implementation, Supabase schema files, automated tests, frontend demo support, and deployment configuration as required.
