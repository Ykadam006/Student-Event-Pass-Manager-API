# Phase 2 Integrations

## Third-party style endpoints

### 1) Tracking endpoint
- Route: `GET /{id}/tracking`
- operationId: `EventPassService_tracking`
- Service: `src/services/tracking.service.ts`
- Provider used in project: `MockShip API`

### 2) Recommendations endpoint
- Route: `GET /students/{studentId}/recommendations`
- operationId: `StudentService_recommendations`
- Service: `src/services/recommendation.service.ts`
- Provider used in project: `Mock Recommendation API`

## Resilience behavior
- Invalid IDs return 404 with explicit messages.
- Handler-level try/catch maps service exceptions to HTTP responses.
- Service layer isolates external-provider simulation from transport layer.
