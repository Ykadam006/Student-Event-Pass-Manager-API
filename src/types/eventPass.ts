export type EventCategory =
  | "Workshop"
  | "Hackathon"
  | "Seminar"
  | "Networking"
  | "CareerFair";

export type PassType = "Free" | "Standard" | "VIP";

export interface EventPass {
  id: string;
  eventName: string;
  category: EventCategory;
  venue: string;
  eventDate: string;
  capacity: number;
  registeredCount: number;
  passType: PassType;
}

export interface EventPassCreate {
  eventName: string;
  category: EventCategory;
  venue: string;
  eventDate: string;
  capacity: number;
  registeredCount: number;
  passType: PassType;
}

export interface EventPassUpdate {
  eventName?: string;
  category?: EventCategory;
  venue?: string;
  eventDate?: string;
  capacity?: number;
  registeredCount?: number;
  passType?: PassType;
}

export interface UrgentEvent {
  id: string;
  eventName: string;
  fillRate: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
}

export interface CapacityInsights {
  totalEvents: number;
  soldOutEvents: number;
  nearlyFullEvents: number;
  averageFillRate: number;
  urgentEvents: UrgentEvent[];
  categoryBreakdown: CategoryBreakdown[];
}
