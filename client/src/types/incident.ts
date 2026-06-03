export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type IncidentStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "archived";

export type IncidentType =
  | "injury"
  | "near_miss"
  | "equipment_damage"
  | "chemical_spill"
  | "fire"
  | "environmental"
  | "property_damage"
  | "unsafe_condition"
  | "other";

export interface IIncident {
  id: string;
  tenant_id?: string;
  site_id: string;
  title: string;
  description?: string | null;
  incident_type?: IncidentType | string | null;
  task_type?: string | null;
  asset_name?: string | null;
  severity?: IncidentSeverity | string | null;
  occurred_at?: string | null;
  reported_by: string;
  root_cause?: string | null;
  corrective_action?: string | null;
  lessons_learned?: string | null;
  status: IncidentStatus | string;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateIncidentPayload {
  site_id: string;
  title: string;
  description?: string;
  incident_type?: string;
  task_type?: string;
  asset_name?: string;
  severity?: string;
  occurred_at?: string;
  root_cause?: string;
  corrective_action?: string;
  lessons_learned?: string;
}

export interface IUpdateIncidentPayload {
  site_id?: string;
  title?: string;
  description?: string;
  incident_type?: string;
  task_type?: string;
  asset_name?: string;
  severity?: string;
  occurred_at?: string;
  root_cause?: string;
  corrective_action?: string;
  lessons_learned?: string;
  status?: string;
}

export interface IIncidentStatusPayload {
  status: string;
}
