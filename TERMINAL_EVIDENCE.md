# Terminal Evidence (Build + Tests)

This file captures the local terminal output for the required commands.

## Backend build

```text
npm run build

npm warn Unknown env config "devdir". This will stop working in the next major version of npm.

> student-event-pass-manager-api@1.0.0 build
> tsc
```

## Tests

```text
npm test

npm warn Unknown env config "devdir". This will stop working in the next major version of npm.

> student-event-pass-manager-api@1.0.0 test
> NODE_ENV=test tsx --test src/tests/*.test.ts

TAP version 13
# Subtest: GraphQL: query events with filtering/pagination
ok 1 - GraphQL: query events with filtering/pagination
# Subtest: GraphQL: create/update/delete event mutation flow
ok 2 - GraphQL: create/update/delete event mutation flow
# Subtest: GraphQL: invalid event id returns error
ok 3 - GraphQL: invalid event id returns error
# Subtest: REST: GET /openapi.json works
ok 4 - REST: GET /openapi.json works
# Subtest: REST: GET / returns event list
ok 5 - REST: GET / returns event list
# Subtest: REST: GET /{id}/tracking returns third-party tracking data
ok 6 - REST: GET /{id}/tracking returns third-party tracking data
# Subtest: REST: GET /students/{studentId}/recommendations returns recommendations
ok 7 - REST: GET /students/{studentId}/recommendations returns recommendations
1..7
# pass 7
# fail 0
```

## Frontend build

```text
npm run client:build

npm warn Unknown env config "devdir". This will stop working in the next major version of npm.

> student-event-pass-manager-api@1.0.0 client:build
> vite build --config client/vite.config.cjs

vite v6.4.2 building for production...
✓ 16 modules transformed.
✓ built in 107ms
```

