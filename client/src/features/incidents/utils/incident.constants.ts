export const INCIDENT_SEVERITIES = ["low", "medium", "high", "critical"] as const;

export const INCIDENT_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "archived",
] as const;

export const INCIDENT_TYPES = [
  "injury",
  "near_miss",
  "equipment_damage",
  "chemical_spill",
  "fire",
  "environmental",
  "property_damage",
  "unsafe_condition",
  "other",
] as const;

export const SEVERITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
};

export const TYPE_LABELS: Record<string, string> = {
  injury: "Injury",
  near_miss: "Near Miss",
  equipment_damage: "Equipment Damage",
  chemical_spill: "Chemical Spill",
  fire: "Fire",
  environmental: "Environmental",
  property_damage: "Property Damage",
  unsafe_condition: "Unsafe Condition",
  other: "Other",
};

export const FILTER_ALL = "__all__";

export const FIELD_WORKER_EDITABLE_STATUSES = ["draft", "submitted"];

export const PREVENTION_NOTE =
  "Approved incidents can be used by the Incident Prevention Agent to surface similar past events.";

export const LEARNING_NOTE =
  "Incidents help the system surface similar past events during future safety checks.";
