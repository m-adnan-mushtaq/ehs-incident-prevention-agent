import type { IVoiceExtractionData } from "@/types/voice-knowledge";

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
};

export const normalizeExtractionData = (
  raw: IVoiceExtractionData | Record<string, unknown>
): IVoiceExtractionData => {
  const data = raw as Record<string, unknown>;
  const nested =
    data.data && typeof data.data === "object" && !Array.isArray(data.data)
      ? (data.data as Record<string, unknown>)
      : data;

  return {
    title: typeof nested.title === "string" ? nested.title : "",
    topic: typeof nested.topic === "string" ? nested.topic : undefined,
    task_type:
      typeof nested.task_type === "string" ? nested.task_type : undefined,
    asset_name:
      typeof nested.asset_name === "string" ? nested.asset_name : undefined,
    risk_level:
      typeof nested.risk_level === "string" ? nested.risk_level : undefined,
    problem: typeof nested.problem === "string" ? nested.problem : undefined,
    root_cause:
      typeof nested.root_cause === "string" ? nested.root_cause : undefined,
    recommended_action:
      typeof nested.recommended_action === "string"
        ? nested.recommended_action
        : undefined,
    lesson_learned:
      typeof nested.lesson_learned === "string"
        ? nested.lesson_learned
        : undefined,
    safety_warning:
      typeof nested.safety_warning === "string"
        ? nested.safety_warning
        : undefined,
    required_ppe: toStringArray(nested.required_ppe),
    stop_work_triggers: toStringArray(nested.stop_work_triggers),
    confidence_score:
      typeof nested.confidence_score === "number"
        ? nested.confidence_score
        : undefined,
    raw_transcript:
      typeof nested.raw_transcript === "string"
        ? nested.raw_transcript
        : undefined,
  };
};
