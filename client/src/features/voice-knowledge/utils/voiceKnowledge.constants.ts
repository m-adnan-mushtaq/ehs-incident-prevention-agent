export const VOICE_SOURCE_TYPE = "voice_transcript";

export const RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

export const KNOWLEDGE_STATUSES = [
  "draft",
  "pending_review",
  "approved",
  "rejected",
  "archived",
  "superseded",
] as const;
