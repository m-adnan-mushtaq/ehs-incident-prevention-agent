import type { IIncidentFormValues } from "./incident-formatters";

export interface IIncidentExtractionData {
  title?: string | null;
  description?: string | null;
  incident_type?: string | null;
  severity?: string | null;
  task_type?: string | null;
  asset_name?: string | null;
  occurred_at?: string | null;
  root_cause?: string | null;
  corrective_action?: string | null;
  lessons_learned?: string | null;
  confidence_score?: number | null;
  raw_transcript?: string | null;
  raw_model_output?: string | null;
}

export const normalizeIncidentExtraction = (
  raw: unknown
): IIncidentExtractionData => {
  if (!raw || typeof raw !== "object") return {};
  const data = raw as Record<string, unknown>;
  if (data.data && typeof data.data === "object") {
    return normalizeIncidentExtraction(data.data);
  }
  return {
    title: typeof data.title === "string" ? data.title : null,
    description: typeof data.description === "string" ? data.description : null,
    incident_type: typeof data.incident_type === "string" ? data.incident_type : null,
    severity: typeof data.severity === "string" ? data.severity : null,
    task_type: typeof data.task_type === "string" ? data.task_type : null,
    asset_name: typeof data.asset_name === "string" ? data.asset_name : null,
    occurred_at: typeof data.occurred_at === "string" ? data.occurred_at : null,
    root_cause: typeof data.root_cause === "string" ? data.root_cause : null,
    corrective_action: typeof data.corrective_action === "string" ? data.corrective_action : null,
    lessons_learned: typeof data.lessons_learned === "string" ? data.lessons_learned : null,
    confidence_score: typeof data.confidence_score === "number" ? data.confidence_score : null,
    raw_transcript: typeof data.raw_transcript === "string" ? data.raw_transcript : null,
    raw_model_output: typeof data.raw_model_output === "string" ? data.raw_model_output : null,
  };
};

export const extractionToIncidentFormValues = (
  extraction: IIncidentExtractionData
): IIncidentFormValues => ({
  site_id: "",
  title: extraction.title ?? "",
  description: extraction.description ?? "",
  incident_type: extraction.incident_type ?? "",
  task_type: extraction.task_type ?? "",
  asset_name: extraction.asset_name ?? "",
  severity: extraction.severity ?? "",
  occurred_at: extraction.occurred_at
    ? toDatetimeLocalFromISO(extraction.occurred_at)
    : "",
  root_cause: extraction.root_cause ?? "",
  corrective_action: extraction.corrective_action ?? "",
  lessons_learned: extraction.lessons_learned ?? "",
  status: "",
});

function toDatetimeLocalFromISO(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}
