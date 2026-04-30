export const typeDefs = `#graphql
  type Event {
    id: ID!
    title: String!
    description: String
    location: String!
    eventDate: String!
    capacity: Int!
    registeredCount: Int!
    availableSeats: Int!
    status: EventStatus!
    registrations: [Registration!]!
  }

  type Student {
    id: ID!
    name: String!
    email: String!
    major: String
    registrations: [Registration!]!
  }

  type Registration {
    id: ID!
    student: Student!
    event: Event!
    status: RegistrationStatus!
    createdAt: String!
  }

  type CapacityInsight {
    totalEvents: Int!
    totalCapacity: Int!
    totalRegistered: Int!
    totalAvailableSeats: Int!
    averageFillRate: Float!
    fullEvents: Int!
  }

  enum EventStatus {
    UPCOMING
    FULL
    CANCELLED
    COMPLETED
  }

  enum RegistrationStatus {
    REGISTERED
    CANCELLED
  }

  input EventFilterInput {
    status: EventStatus
    search: String
    location: String
  }

  input PaginationInput {
    limit: Int = 10
    offset: Int = 0
  }

  input CreateEventInput {
    title: String!
    description: String
    location: String!
    eventDate: String!
    capacity: Int!
    status: EventStatus = UPCOMING
  }

  input UpdateEventInput {
    title: String
    description: String
    location: String
    eventDate: String
    capacity: Int
    status: EventStatus
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    events(filter: EventFilterInput, pagination: PaginationInput): [Event!]!
    event(id: ID!): Event
    students: [Student!]!
    student(id: ID!): Student
    capacityInsights: CapacityInsight!
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event!
    updateEvent(id: ID!, input: UpdateEventInput!): Event!
    deleteEvent(id: ID!): DeleteResponse!
    registerStudent(eventId: ID!, studentId: ID!): Registration!
    cancelRegistration(registrationId: ID!): Registration!
  }
`;
