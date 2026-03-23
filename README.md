# Campus Event Pass Manager API

A contract-first REST API for managing student event passes at a university campus. Built with TypeScript, Express, and openapi-backend using an OpenAPI 3.1.0 specification as the single source of truth.

---

## Why This Domain

Campus events are central to student life — hackathons, workshops, seminars, career fairs, and networking nights all require ticketing and capacity management. This domain is practical, easy to reason about, and naturally supports both standard CRUD operations and a meaningful custom analytics endpoint (capacity insights).

---

## Tech Stack

| Tool | Purpose |
|---|---|
| TypeScript | Type-safe implementation language |
| Express | HTTP server framework |
| openapi-backend | Spec-driven request routing and validation |
| swagger-ui-express | Serves the interactive Swagger UI at `/docs` |
| yamljs | Parses the YAML spec for `/openapi.json` |
| ts-node / nodemon | Local development workflow |
| openapi-typescript | Optional generated types from the YAML spec |

---

## Project Structure

```
student-event-pass-manager-api/
├── openapi.yaml                          ← Contract (single source of truth)
├── package.json
├── tsconfig.json
└── src/
    ├── server.ts                         ← Express app + openapi-backend wiring
    ├── types/
    │   └── eventPass.ts                  ← TypeScript interfaces mirroring YAML schemas
    ├── store/
    │   └── eventPasses.ts                ← In-memory data store with 5 seed records
    └── handlers/
        ├── EventPassService_list.ts
        ├── EventPassService_create.ts
        ├── EventPassService_get.ts
        ├── EventPassService_update.ts
        ├── EventPassService_delete.ts
        └── EventPassService_capacityInsights.ts
```

---

## operationId Mapping

Each `operationId` in `openapi.yaml` maps directly to one handler file:

| operationId | Handler file |
|---|---|
| `EventPassService_list` | `src/handlers/EventPassService_list.ts` |
| `EventPassService_create` | `src/handlers/EventPassService_create.ts` |
| `EventPassService_get` | `src/handlers/EventPassService_get.ts` |
| `EventPassService_update` | `src/handlers/EventPassService_update.ts` |
| `EventPassService_delete` | `src/handlers/EventPassService_delete.ts` |
| `EventPassService_capacityInsights` | `src/handlers/EventPassService_capacityInsights.ts` |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all event passes |
| POST | `/` | Create a new event pass |
| GET | `/{id}` | Get one event pass by ID |
| PATCH | `/{id}` | Partially update an event pass |
| DELETE | `/{id}` | Delete an event pass |
| GET | `/capacity-insights` | Custom analytics: capacity and fill rate summary |
| GET | `/docs` | Swagger UI |
| GET | `/openapi.yaml` | Raw OpenAPI spec (YAML) |
| GET | `/openapi.json` | Raw OpenAPI spec (JSON) |

---

## Local Setup

```bash
git clone https://github.com/Ykadam006/Student-Event-Pass-Manager-API.git
cd Student-Event-Pass-Manager-API
npm install
```

## Run Locally

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

Open the Swagger UI at: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Build for Production

```bash
npm run build
npm start
```

---

## Deployed URL

| Endpoint | URL |
|---|---|
| Swagger UI | https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/docs |
| OpenAPI YAML | https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/openapi.yaml |
| OpenAPI JSON | https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/openapi.json |
| List all passes | https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/ |
| Capacity insights | https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/capacity-insights |

## Azure Deployment

This app is deployed on **Azure App Service** (Linux, Node 24 LTS).

**Deploy steps:**
1. Push to GitHub (do not push `node_modules`)
2. Create an Azure App Service — Publish: Code, Runtime: Node 24 LTS, OS: Linux
3. In the App Service → Deployment Center, connect your GitHub repo and branch
4. Azure automatically runs `npm install && npm run build` then `npm start`

---

## Reflection

For this assignment, I chose to build a Campus Event Pass Manager API because it is practical, easy to understand, and well suited for both CRUD operations and a meaningful custom analytics endpoint. I wanted a domain that felt realistic for a university setting while also giving me enough flexibility to model enums, numeric fields, and derived data. I used TypeScript, Express, and openapi-backend because that stack was discussed in class and clearly demonstrated in the tutorial, which made it a strong choice for understanding the contract-first workflow.

The biggest lesson I learned from this project is that contract-first development changes the order of thinking. Instead of writing routes and logic first, I had to design the API structure carefully in the OpenAPI YAML before implementing any server code. That made me think more clearly about paths, request bodies, response schemas, status codes, and naming conventions. Once the contract was in place, the implementation became much easier because the spec acted like a blueprint.

One challenge I faced was making sure the schemas, handler logic, and TypeScript interfaces all stayed aligned. Another important detail was the route registration order in Express. I learned that `/docs`, `/openapi.yaml`, and `/openapi.json` must be registered before the catch-all request handler, otherwise they return 404 errors. I also learned how valuable `validate: true` is in openapi-backend, because it automatically rejects invalid requests such as missing required fields or incorrect enum values before they reach the business logic.

Compared with code-first development, the contract-first approach feels more disciplined and professional. It requires more planning in the beginning, but it reduces confusion later because the spec becomes the single source of truth. Overall, this project helped me understand how API design, validation, documentation, and implementation all connect in a clean and maintainable workflow.
