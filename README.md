# Campus Event Pass Manager API

A contract-first REST API for managing student event passes at a university campus. Built with TypeScript, Express, and openapi-backend using an OpenAPI 3.1.0 specification as the single source of truth.

---

## Midterm assignment alignment (course PDF)

This repo is structured for **Midterm Presentation — From Prototype to Production** (database integration, generated client, cloud deployment, 10‑minute presentation). Below is a direct mapping to the official deliverables and checklist.

### Submission artifacts (due ≥24 hours before your presentation slot)

| # | Required artifact | This project |
|---|-------------------|--------------|
| 1 | **GitHub repository** — updated server, generated client directory, client app source, README | [github.com/Ykadam006/Student-Event-Pass-Manager-API](https://github.com/Ykadam006/Student-Event-Pass-Manager-API) |
| 2 | **Live API URL** — public `/docs` backed by cloud DB | [Azure Swagger UI](https://student-event-pass-manager-api-gxetbzfvfefdakeb.eastus-01.azurewebsites.net/docs) |
| 3 | **Live client URL** — talks to **deployed** API, not localhost | [Vercel client](https://student-event-pass-manager-api.vercel.app/) |


### Client generation tool (README deliverable)

| Item | Detail |
|------|--------|
| **Tool** | [**@hey-api/openapi-ts**](https://github.com/hey-api/openapi-ts) (`openapi-ts` CLI) with [**@hey-api/client-fetch**](https://heyapi.dev) |
| **Command** | `npm run generate:client` |
| **Output** | Committed under **`generated-client/`** (do not edit by hand) |
| **SDK ↔ spec** | Each `operationId` in `openapi.yaml` maps to `eventPassService*` in `generated-client/sdk.gen.ts` (see table under [operationId Mapping](#operationid-mapping)) |

### Minimal client requirements (Part 2)

The Vite app in **`client/`** calls **only** the generated SDK (`eventPassServiceList`, `eventPassServiceCreate`, `eventPassServiceDelete`, `eventPassServiceCapacityInsights`). It does **not** use raw `fetch`/`axios` for API routes. Default API host is the **first** entry in `openapi.yaml` `servers` (Azure production).

### Pre-submission checklist (mirror of assignment §11)

**Implemented in this repository (verify live before your slot):**

- [x] Cloud database: **Supabase (PostgreSQL)**; all six operations use `src/store/eventPasses.ts` (no in-memory store).
- [x] Seed data: `supabase/schema.sql` — run in Supabase SQL Editor; API returns the same resource shape as the OpenAPI schemas.
- [x] Credentials: `SUPABASE_*` via environment variables only; **`.env.example`** at repo root; **`client/.env.example`** for optional `VITE_API_BASE_URL`.
- [x] Generated client committed under **`generated-client/`**.
- [x] Client uses generated SDK only (no hand-written HTTP for those calls).
- [x] Client demonstrates **list, create, delete**, and **custom** (`/capacity-insights`) against the live API when built without overriding the base URL.
- [x] `openapi.yaml` **servers** includes the deployed Azure URL (first server = default SDK base).
- [x] **`/openapi.yaml`**, **`/openapi.json`**, and **`/docs`** are served by the API (see `src/server.ts`).

**You must still confirm manually (grading / demo):**

- [ ] **POST** creates a row that **survives** an API restart (Supabase persistence).
- [ ] **Swagger UI** on Azure: every **Try it out** operation succeeds.
- [ ] **Vercel** build uses `VITE_API_BASE_URL` if needed so the client hits Azure (default build uses spec’s first server).
- [ ] **Slide deck** submitted as PDF or link; **rehearse** to fit **10 minutes** (8–12 min window per rubric).
- [ ] **Backup demo** (screenshots or short recording) if live network fails during presentation.

### Presentation structure (assignment §9 — for your slide deck)

Use this as the spine for your **10‑minute** deck; demo in the browser, not only slides.

1. **~1 min — Introduction** — Campus event passes domain, main resource, one architecture diagram (browser → client → API → Supabase).
2. **~2 min — OpenAPI** — Key schemas, enums, `operationIds`; show live **`/docs`** briefly.
3. **~2 min — Database** — Why Supabase/Postgres; show **`event_passes`** structure (`supabase/schema.sql`); only the **store** layer changed vs Assignment 1.
4. **~2 min — Client generation** — Hey API tool, what landed in `generated-client/`; one code snippet of `eventPassServiceCreate` (or similar) from `client/src/main.ts`.
5. **~2 min — Live demo** — Client: create → **Swagger** shows new row → list + **capacity insights** → optional Supabase **Table Editor** to show persistence.
6. **~1 min — Lessons learned** — Contract-first: one spec for validation, docs, and client.

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
| tsx / nodemon | Local development workflow (`npm run dev`) |
| openapi-typescript | Optional generated types from the YAML spec |
| Supabase (PostgreSQL) | Cloud database for event passes |
| @supabase/supabase-js | Server-side access with the service role key |
| dotenv | Loads `SUPABASE_*` variables from `.env` locally |
| **@hey-api/openapi-ts** | Generates the typed fetch SDK in `generated-client/` from `openapi.yaml` |
| Vite | Builds the minimal browser client in `client/` |

---

## Project Structure

```
student-event-pass-manager-api/
├── openapi.yaml                          ← Contract (single source of truth)
├── generated-client/                     ← Generated SDK (npm run generate:client) — do not edit by hand
├── client/                               ← Minimal SPA using only the generated SDK
│   ├── index.html
│   ├── src/main.ts
│   └── vite.config.cjs
├── supabase/
│   └── schema.sql                        ← Table + seed data (run in Supabase SQL Editor)
├── package.json
├── tsconfig.json
├── .env.example                          ← Template for local secrets (copy to .env)
└── src/
    ├── server.ts                         ← Express + explicit CORS headers + openapi-backend
    ├── lib/
    │   └── supabase.ts                   ← Supabase client (service role)
    ├── types/
    │   └── eventPass.ts                  ← TypeScript interfaces mirroring YAML schemas
    ├── store/
    │   └── eventPasses.ts                ← Database access layer (CRUD + insights)
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

### Generated SDK mapping (midterm)

The **@hey-api/openapi-ts** client in `generated-client/sdk.gen.ts` maps each `operationId` to a camelCase function:

| operationId | SDK function |
|---|---|
| `EventPassService_list` | `eventPassServiceList` |
| `EventPassService_create` | `eventPassServiceCreate` |
| `EventPassService_get` | `eventPassServiceGet` |
| `EventPassService_update` | `eventPassServiceUpdate` |
| `EventPassService_delete` | `eventPassServiceDelete` |
| `EventPassService_capacityInsights` | `eventPassServiceCapacityInsights` |

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

## Supabase database

1. In the [Supabase dashboard](https://supabase.com/dashboard), open your project → **SQL Editor**.
2. Paste and run the contents of `supabase/schema.sql`. That creates `public.event_passes`, enables RLS, and inserts the five seed rows (`on conflict do nothing` so it is safe to re-run).
3. Under **Project Settings → API**, copy **Project URL** and the **service_role** key (server only; never expose it in a browser app).

The API uses the **service role** key so it can read and write regardless of RLS policies.

### Database schema (summary)

Table **`public.event_passes`** (PostgreSQL on Supabase):

| Column | Type | Notes |
|--------|------|--------|
| `id` | `text` | Primary key |
| `event_name` | `text` | Maps to API `eventName` |
| `category` | `text` | Enum: Workshop, Hackathon, Seminar, Networking, CareerFair |
| `venue` | `text` | |
| `event_date` | `date` | Maps to API `eventDate` (`YYYY-MM-DD`) |
| `capacity` | `integer` | \> 0 |
| `registered_count` | `integer` | ≥ 0; maps to API `registeredCount` |
| `pass_type` | `text` | Enum: Free, Standard, VIP |

Full DDL and seed inserts are in `supabase/schema.sql`.

---

## Generate the typed API client (midterm)

Tool: [**@hey-api/openapi-ts**](https://github.com/hey-api/openapi-ts) with the **`@hey-api/client-fetch`** template.

```bash
npm run generate:client
```

Output directory: **`generated-client/`** (committed). Regenerate whenever `openapi.yaml` changes.

---

## Browser client (midterm)

The **`client/`** app is a small Vite + TypeScript page. It performs **list**, **create**, **delete**, and **capacity insights** using **only** the generated SDK (`eventPassServiceList`, `eventPassServiceCreate`, `eventPassServiceDelete`, `eventPassServiceCapacityInsights`). It does not call `fetch` directly for those operations.

### Run the client locally

```bash
# Terminal 1 — API (optional if you only hit Azure)
npm run dev

# Terminal 2 — client dev server
npm run client:dev
```

Open **http://localhost:5173**. By default the SDK uses the **first** `servers` URL from `openapi.yaml` (your Azure API). To call a local API instead, copy `client/.env.example` to `client/.env` and set:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

### Build static client (for Netlify / Vercel / GitHub Pages)

```bash
npm install
npm run generate:client
npm run client:build
```

Static files are written to **`client/dist/`**. Point your host’s publish directory to **`client/dist`**. Build command example on Vercel/Netlify:

`npm install && npm run generate:client && npm run client:build`

After deploy, add your **live client URL** to the midterm submission. The API sets **`Access-Control-Allow-Origin`** on every response (reflecting the browser `Origin`, e.g. `http://localhost:5173`) so the Vite client can call Azure cross-origin. **Push and redeploy** after CORS changes or the browser will show “blocked by CORS policy”.

---

## Local Setup

```bash
git clone https://github.com/Ykadam006/Student-Event-Pass-Manager-API.git
cd Student-Event-Pass-Manager-API
npm install
cp .env.example .env
# Edit .env: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
```

## Run Locally

```bash
npm run dev
```

Development uses **`tsx`** (via nodemon) so the Node process stays running; plain `ts-node` can exit immediately after startup on some setups.

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
1. Push to GitHub (do not push `node_modules` or `.env`)
2. Create an Azure App Service — Publish: Code, Runtime: Node 24 LTS, OS: Linux
3. In the App Service → Deployment Center, connect your GitHub repo and branch
4. Azure automatically runs `npm install && npm run build` then `npm start`

**Required application settings (Settings → Environment variables):**

| Name | Value |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role secret |

Without these, the API responds with `500` on data routes.

### Azure returns 500 on `GET /` (browser or curl)

A JSON body like `{"code":500,"message":"Internal Server Error"}` comes from your handlers when **Supabase** throws (almost always **missing or wrong** `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` in **Azure → App Service → Settings → Environment variables**). Fix the values, save, wait for the app to restart, and try again. Check **Log stream** in the portal for `[config]` warnings or stack traces.

### `ReferenceError: cors is not defined`

That was from an older `server.ts` that still called `cors()` after the `cors` package was removed. Use the current file (manual `setCorsHeaders` only), then run `npm run build` and restart `npm run dev`.

Redeploy the API after midterm changes so **CORS** and any updates are live.

### Live client URL

| | URL |
|---|---|
| **Midterm client (static site)** | https://student-event-pass-manager-api.vercel.app/ |

---

## Reflection

For this assignment, I chose to build a Campus Event Pass Manager API because it is practical, easy to understand, and well suited for both CRUD operations and a meaningful custom analytics endpoint. I wanted a domain that felt realistic for a university setting while also giving me enough flexibility to model enums, numeric fields, and derived data. I used TypeScript, Express, and openapi-backend because that stack was discussed in class and clearly demonstrated in the tutorial, which made it a strong choice for understanding the contract-first workflow.

The biggest lesson I learned from this project is that contract-first development changes the order of thinking. Instead of writing routes and logic first, I had to design the API structure carefully in the OpenAPI YAML before implementing any server code. That made me think more clearly about paths, request bodies, response schemas, status codes, and naming conventions. Once the contract was in place, the implementation became much easier because the spec acted like a blueprint.

One challenge I faced was making sure the schemas, handler logic, and TypeScript interfaces all stayed aligned. Another important detail was the route registration order in Express. I learned that `/docs`, `/openapi.yaml`, and `/openapi.json` must be registered before the catch-all request handler, otherwise they return 404 errors. I also learned how valuable `validate: true` is in openapi-backend, because it automatically rejects invalid requests such as missing required fields or incorrect enum values before they reach the business logic.

Compared with code-first development, the contract-first approach feels more disciplined and professional. It requires more planning in the beginning, but it reduces confusion later because the spec becomes the single source of truth. Overall, this project helped me understand how API design, validation, documentation, and implementation all connect in a clean and maintainable workflow.
