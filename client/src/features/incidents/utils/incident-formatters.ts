import { formatDateTime } from "@/helpers/common";
import type { IIncident } from "@/types/incident";
import type { ISite } from "@/types/site";
import { TYPE_LABELS } from "./incident.constants";

export const formatSiteName = (
  siteId: string,
  sites: ISite[]
): string => sites.find((s) => s.id === siteId)?.name ?? siteId;

export const formatReporter = (
  reportedBy: string,
  currentUserId?: string
): string => {
  if (currentUserId && reportedBy === currentUserId) return "You";
  return `Reporter ${reportedBy.slice(0, 8)}…`;
};

export const formatOccurredAt = (value?: string | null): string =>
  value ? formatDateTime(value) : "—";

export const formatIncidentType = (type?: string | null): string =>
  type ? (TYPE_LABELS[type] ?? type.replace(/_/g, " ")) : "—";

export const toDatetimeLocalValue = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const fromDatetimeLocalValue = (value?: string): string | undefined => {
  if (!value?.trim()) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

export interface IIncidentFormValues {
  site_id: string;
  title: string;
  description: string;
  incident_type: string;
  task_type: string;
  asset_name: string;
  severity: string;
  occurred_at: string;
  root_cause: string;
  corrective_action: string;
  lessons_learned: string;
  status: string;
}

export const emptyIncidentFormValues = (): IIncidentFormValues => ({
  site_id: "",
  title: "",
  description: "",
  incident_type: "",
  task_type: "",
  asset_name: "",
  severity: "",
  occurred_at: "",
  root_cause: "",
  corrective_action: "",
  lessons_learned: "",
  status: "",
});

export const incidentToFormValues = (incident: IIncident) => ({
  site_id: incident.site_id,
  title: incident.title,
  description: incident.description ?? "",
  incident_type: incident.incident_type ?? "",
  task_type: incident.task_type ?? "",
  asset_name: incident.asset_name ?? "",
  severity: incident.severity ?? "",
  occurred_at: toDatetimeLocalValue(incident.occurred_at),
  root_cause: incident.root_cause ?? "",
  corrective_action: incident.corrective_action ?? "",
  lessons_learned: incident.lessons_learned ?? "",
  status: incident.status ?? "",
});

export const buildCreatePayload = (
  values: IIncidentFormValues
): import("@/types/incident").ICreateIncidentPayload => ({
  site_id: values.site_id,
  title: values.title.trim(),
  description: values.description?.trim() || undefined,
  incident_type: values.incident_type || undefined,
  task_type: values.task_type?.trim() || undefined,
  asset_name: values.asset_name?.trim() || undefined,
  severity: values.severity || undefined,
  occurred_at: fromDatetimeLocalValue(values.occurred_at),
  root_cause: values.root_cause?.trim() || undefined,
  corrective_action: values.corrective_action?.trim() || undefined,
  lessons_learned: values.lessons_learned?.trim() || undefined,
});

export const buildUpdatePayload = (
  values: IIncidentFormValues,
  includeStatus: boolean
): import("@/types/incident").IUpdateIncidentPayload => {
  const base = buildCreatePayload(values);
  const { site_id: _s, ...rest } = base;
  return {
    ...rest,
    site_id: values.site_id,
    ...(includeStatus && values.status ? { status: values.status } : {}),
  };
};

export const canEditIncident = (
  role: string | null,
  incident: IIncident,
  userId?: string
): boolean => {
  if (role === "admin" || role === "sme") return incident.status !== "archived";
  if (role === "field_worker" && userId) {
    return (
      incident.reported_by === userId &&
      ["draft", "submitted"].includes(incident.status)
    );
  }
  return false;
};

export const canArchiveIncident = (
  role: string | null,
  incident: IIncident,
  userId?: string
): boolean => {
  if (incident.status === "archived") return false;
  if (role === "admin" || role === "sme") return true;
  if (role === "field_worker" && userId) {
    return incident.reported_by === userId && incident.status === "draft";
  }
  return false;
};
