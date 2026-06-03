import type { IVoiceExtractionData } from "@/types/voice-knowledge";
import type { IVoiceKnowledgeFormValues } from "@/types/voice-knowledge";

export const extractionToFormValues = (
  data: IVoiceExtractionData
): IVoiceKnowledgeFormValues => ({
  title: data.title?.trim() || "",
  topic: data.topic ?? "",
  task_type: data.task_type ?? "",
  asset_name: data.asset_name ?? "",
  risk_level: data.risk_level ?? "",
  problem: data.problem ?? "",
  root_cause: data.root_cause ?? "",
  recommended_action: data.recommended_action ?? "",
  lesson_learned: data.lesson_learned ?? "",
  safety_warning: data.safety_warning ?? "",
  required_ppe: data.required_ppe ?? [],
  stop_work_triggers: data.stop_work_triggers ?? [],
  sme_notes: data.raw_transcript ?? "",
  site_id: "",
});
