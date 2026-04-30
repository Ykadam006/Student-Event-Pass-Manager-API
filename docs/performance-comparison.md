# REST vs GraphQL Comparison

REST requires multiple endpoints for different resources such as `/`, `/{id}`, and `/capacity-insights`. GraphQL provides a single `/graphql` endpoint where clients request only the fields they need.

Example: if a frontend only needs `title`, `location`, and `availableSeats`, GraphQL returns only those fields. REST returns the full event object for `GET /` unless extra endpoint/query customization is added.

In this project, REST is useful for contract-first resource operations and Swagger tooling, while GraphQL is useful for flexible field selection, nested relationships (`event -> registrations -> student`), and filter/pagination in one query.
