import type { IVoiceExtractionData } from "@/types/voice-knowledge";
import type { IVoiceKnowledgeFormValues } from "@/types/voice-knowledge";
import { normalizeExtractionData } from "../utils/normalizeExtraction";

export const SITE_NONE_VALUE = "__site_none__";

export const emptyFormValues = (): IVoiceKnowledgeFormValues => ({
  title: "",
  topic: "",
  task_type: "",
  asset_name: "",
  risk_level: "",
  problem: "",
  root_cause: "",
  recommended_action: "",
  lesson_learned: "",
  safety_warning: "",
  required_ppe: [],
  stop_work_triggers: [],
  sme_notes: "",
  site_id: SITE_NONE_VALUE,
});

export const extractionToFormValues = (
  data: IVoiceExtractionData
): IVoiceKnowledgeFormValues => {
  const normalized = normalizeExtractionData(data);
  const risk =
    normalized.risk_level &&
    ["low", "medium", "high", "critical"].includes(
      normalized.risk_level.toLowerCase()
    )
      ? normalized.risk_level.toLowerCase()
      : normalized.risk_level ?? "";

  return {
    title: normalized.title?.trim() || "",
    topic: normalized.topic ?? "",
    task_type: normalized.task_type ?? "",
    asset_name: normalized.asset_name ?? "",
    risk_level: risk,
    problem: normalized.problem ?? "",
    root_cause: normalized.root_cause ?? "",
    recommended_action: normalized.recommended_action ?? "",
    lesson_learned: normalized.lesson_learned ?? "",
    safety_warning: normalized.safety_warning ?? "",
    required_ppe: normalized.required_ppe ?? [],
    stop_work_triggers: normalized.stop_work_triggers ?? [],
    sme_notes: normalized.raw_transcript ?? "",
    site_id: SITE_NONE_VALUE,
  };
};
