# Submission Screenshots

Add your PNG (or JPG) files to this folder using the filenames below.  
**These cannot be auto-generated here** — capture them on your machine after the API and client are running (or use your live Azure/Vercel URLs).

---

## How to capture

- **Browser:** full window or visible tab; include URL bar when helpful.
- **Terminal:** show command + successful output.
- **Naming:** use the exact filenames so your professor can match the checklist quickly.

---

## Required screenshots (minimum strong set)

| # | Filename | What to show | How to get it |
|---|----------|--------------|---------------|
| 1 | `01-github-repo.png` | Your GitHub repository main page with file tree visible | Open repo in browser |
| 2 | `02-swagger-docs.png` | Swagger UI (`/docs`) with operations listed | `https://<your-api>/docs` |
| 3 | `03-openapi-yaml.png` | OpenAPI spec in browser or raw YAML | `https://<your-api>/openapi.yaml` |
| 4 | `04-rest-list-events.png` | Successful `GET /` (list all event passes) | Swagger “Try it out” or frontend “List all passes” |
| 5 | `05-rest-get-by-id.png` | Successful `GET /{id}` | Use a real id from list |
| 6 | `06-rest-create.png` | Successful `POST /` (201 + body) | Swagger or frontend create form |
| 7 | `07-rest-update.png` | Successful `PATCH /{id}` | Swagger or frontend update |
| 8 | `08-rest-delete.png` | Successful `DELETE /{id}` | Swagger or frontend delete |
| 9 | `09-capacity-insights.png` | Successful `GET /capacity-insights` | Swagger or frontend |
| 10 | `10-tracking-endpoint.png` | Successful `GET /{id}/tracking` | Swagger or frontend integrations |
| 11 | `11-recommendations-endpoint.png` | Successful `GET /students/{studentId}/recommendations` (e.g. `stu_1`) | Swagger or frontend |
| 12 | `12-graphql-events-query.png` | GraphQL `events` query with `data` in response | Apollo Sandbox, Postman, or frontend GraphQL panel |
| 13 | `13-graphql-capacity-insights.png` | GraphQL `capacityInsights` query | Same tool |
| 14 | `14-graphql-create-mutation.png` | GraphQL `createEvent` mutation success | Same tool |
| 15 | `15-graphql-nested-relationship.png` | Nested query e.g. `event(id) { registrations { student { name } } }` | Same tool |
| 16 | `16-npm-test-pass.png` | Terminal: `npm test` with all tests passing | Run in project root |
| 17 | `17-npm-build-pass.png` | Terminal: `npm run build` success | Run in project root |
| 18 | `18-client-build-pass.png` | Terminal: `npm run client:build` success | Run in project root |
| 19 | `19-frontend-demo.png` | Your Vite UI showing REST + GraphQL sections | `npm run client:dev` or Vercel URL |
| 20 | `20-supabase-tables.png` | Supabase Table Editor: `event_passes` and/or `students`, `events`, `registrations` | Supabase dashboard |
| 21 | `21-github-actions-success.png` | GitHub Actions workflow run green | Repo → Actions |
| 22 | `22-azure-app-live.png` | Azure App Service overview or browse URL working | Azure portal or browser on base URL |

---

## Optional but helpful

| Filename | What to show |
|----------|--------------|
| `23-openapi-json.png` | `GET /openapi.json` snippet |
| `24-graphql-error-handling.png` | GraphQL response with `errors` for invalid id (shows validation) |
| `25-sql-join-query.png` | Supabase SQL Editor: join `registrations` + `students` + `events` |

---

## Quick URL reference (replace with yours if different)

- **API base:** from `README.md` or `FINAL_SUBMISSION.md`
- **Swagger:** `{base}/docs`
- **GraphQL:** POST `{base}/graphql` with `Content-Type: application/json` body `{"query":"..."}`

---

## Checklist before zip/submit

- [ ] At least **15** of the numbered screenshots above
- [ ] Include **tests + build** terminal shots
- [ ] Include **live** REST + GraphQL proof (local or Azure)
- [ ] Include **Supabase** evidence if you use `schema_v2.sql` tables

---

## Note

Image files are **not committed** by default if you use `.gitignore` for `*.png`.  
Either commit screenshots for grading, or attach them separately to your LMS submission alongside this repo.
