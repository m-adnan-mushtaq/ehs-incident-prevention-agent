import type { ICreateKnowledgeObjectPayload } from "@/types/knowledge-object";
import type { IVoiceExtractionData } from "@/types/voice-knowledge";
import type { UserRole } from "@/types/user";
import { VOICE_SOURCE_TYPE } from "./voiceKnowledge.constants";

const isAutoApprovedRole = (role: UserRole | string | null): boolean =>
  role === "sme" || role === "admin";

export const mapVoiceExtractionToKnowledgePayload = ({
  extraction,
  role,
  siteIds,
  overrides,
}: {
  extraction: IVoiceExtractionData;
  role: UserRole | string | null;
  siteIds?: string[];
  overrides?: Partial<IVoiceExtractionData & { sme_notes?: string }>;
}): ICreateKnowledgeObjectPayload => {
  const merged = { ...extraction, ...overrides };
  const status = isAutoApprovedRole(role) ? "approved" : "pending_review";

  return {
    source_type: VOICE_SOURCE_TYPE,
    title: merged.title?.trim() || "Untitled safety note",
    topic: merged.topic,
    task_type: merged.task_type,
    asset_name: merged.asset_name,
    risk_level: merged.risk_level,
    problem: merged.problem,
    root_cause: merged.root_cause,
    recommended_action: merged.recommended_action,
    lesson_learned: merged.lesson_learned,
    safety_warning: merged.safety_warning,
    required_ppe: merged.required_ppe ?? [],
    stop_work_triggers: merged.stop_work_triggers ?? [],
    confidence_score: merged.confidence_score,
    sme_notes: merged.sme_notes ?? merged.raw_transcript,
    status,
    site_ids: siteIds?.length ? siteIds : undefined,
  };
};

export const getSaveStatusMessage = (role: UserRole | string | null): string => {
  if (isAutoApprovedRole(role)) {
    return "This note will be saved as approved knowledge.";
  }
  return "Your note will be sent for SME review before it becomes trusted knowledge.";
};
