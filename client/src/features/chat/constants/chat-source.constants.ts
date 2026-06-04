export const CHAT_SOURCE_TYPE_DOCUMENT = "document" as const;
export const CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT = "knowledge_object" as const;
export const CHAT_SOURCE_TYPE_INCIDENT = "incident" as const;

export const CHAT_PREVIEWABLE_SOURCE_TYPES = [
  CHAT_SOURCE_TYPE_DOCUMENT,
  CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT,
  CHAT_SOURCE_TYPE_INCIDENT,
] as const;

export type TChatPreviewableSourceType =
  (typeof CHAT_PREVIEWABLE_SOURCE_TYPES)[number];

export const isChatPreviewableSourceType = (
  sourceType?: string,
): sourceType is TChatPreviewableSourceType =>
  CHAT_PREVIEWABLE_SOURCE_TYPES.includes(
    sourceType as TChatPreviewableSourceType,
  );
