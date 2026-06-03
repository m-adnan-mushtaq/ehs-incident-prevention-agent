import type {
  IChatFinalResponse,
  IChatMessage,
  IChatSocketPayload,
  ISafetyAnswerCard,
  ISourceCitation,
  TChatMode,
} from "@/types/chat";
import { CHAT_MODE_LABELS } from "./chat.constants";
import { format } from "date-fns";

export const getApiOrigin = (): string => {
  const raw = import.meta.env.VITE_API_URL || window.location.origin;
  try {
    return new URL(raw).origin;
  } catch {
    return window.location.origin;
  }
};

export const formatChatMode = (mode?: string | null): string =>
  CHAT_MODE_LABELS[mode ?? ""] ?? "Safety Chat";

export const formatChatTimestamp = (value?: string | null): string => {
  if (!value) return "";
  try {
    return format(new Date(value), "MMM d, yyyy h:mm a");
  } catch {
    return "";
  }
};

export const formatConfidence = (score?: number | null): string => {
  if (score == null || Number.isNaN(score)) return "N/A";
  return `${Math.round(score * 100)}%`;
};

/** Coerces API/LLM list fields (string, object, mixed array) into string[]. */
export const toStringList = (value: unknown): string[] => {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string") {
        const trimmed = item.trim();
        return trimmed ? [trimmed] : [];
      }
      if (typeof item === "number" || typeof item === "boolean") {
        return [String(item)];
      }
      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        const text = row.summary ?? row.title ?? row.description ?? row.text;
        if (typeof text === "string" && text.trim()) return [text.trim()];
      }
      return [];
    });
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
};

const pickListField = (
  raw: Record<string, unknown>,
  nested: Record<string, unknown> | null,
  ...keys: string[]
): string[] => {
  for (const key of keys) {
    const top = toStringList(raw[key]);
    if (top.length) return top;
    if (nested) {
      const inner = toStringList(nested[key]);
      if (inner.length) return inner;
    }
  }
  return [];
};

/**
 * Normalizes backend cards for UI: flat incident-prevention fields and nested
 * knowledge_card `answer` objects both map to a single ISafetyAnswerCard shape.
 */
export const normalizeSafetyCard = (
  card: Record<string, unknown> | ISafetyAnswerCard,
  fallbackAnswer?: string
): ISafetyAnswerCard => {
  const raw = card as Record<string, unknown>;
  const nested =
    raw.answer && typeof raw.answer === "object" && !Array.isArray(raw.answer)
      ? (raw.answer as Record<string, unknown>)
      : null;

  const answerText =
    typeof raw.answer === "string"
      ? raw.answer
      : typeof nested?.summary === "string"
        ? nested.summary
        : (fallbackAnswer ?? "");

  const citations = Array.isArray(raw.citations)
    ? (raw.citations as ISourceCitation[])
    : Array.isArray(raw.sources)
      ? (raw.sources as ISourceCitation[])
      : undefined;

  return {
    answer: answerText,
    risk_level:
      typeof raw.risk_level === "string" ? raw.risk_level : undefined,
    task: typeof raw.task === "string" ? raw.task : undefined,
    note: typeof raw.note === "string" ? raw.note : undefined,
    confidence_score:
      typeof raw.confidence_score === "number"
        ? raw.confidence_score
        : undefined,
    must_verify: pickListField(raw, nested, "must_verify"),
    required_ppe: pickListField(raw, nested, "required_ppe", "ppe"),
    stop_work_triggers: pickListField(raw, nested, "stop_work_triggers"),
    common_mistakes: pickListField(raw, nested, "common_mistakes"),
    similar_incidents: pickListField(raw, nested, "similar_incidents"),
    steps: pickListField(raw, nested, "steps"),
    warnings: pickListField(raw, nested, "warnings"),
    citations,
  };
};

export const sourceTypeLabel = (sourceType?: string): string => {
  switch (sourceType) {
    case "document":
      return "Document";
    case "incident":
      return "Incident";
    case "knowledge_object":
      return "Expert Note";
    default:
      return "Source";
  }
};

export const laneLabel = (lane?: string): string => {
  switch (lane) {
    case "official_guidance":
      return "Official Guidance";
    case "similar_incidents":
      return "Similar Incidents";
    case "expert_knowledge":
      return "Expert Knowledge";
    default:
      return lane?.replace(/_/g, " ") ?? "Source";
  }
};

/**
 * Resolves a card for rendering. If the backend already stored a `card`
 * in rag_metadata (new messages), use it directly. For older messages
 * that only have citations + confidence_score, build a minimal card
 * so the structured UI still renders.
 */
export const buildCardFromMetadata = (
  card: Record<string, unknown> | undefined,
  citations: ISourceCitation[] | undefined,
  confidenceScore?: number | null,
  content?: string,
): Record<string, unknown> | null => {
  if (card && Object.keys(card).length > 0) return card;

  const hasCitations = citations && citations.length > 0;
  const hasConfidence = confidenceScore != null;
  if (!hasCitations && !hasConfidence) return null;

  return {
    answer: content ?? "",
    citations: citations ?? [],
    confidence_score: confidenceScore ?? undefined,
  };
};

export const buildOptimisticUserMessage = (
  sessionId: string,
  content: string,
  tempId: string
): IChatMessage => ({
  id: tempId,
  chat_session_id: sessionId,
  tenant_id: "",
  role: "user",
  content,
  message_type: "text",
});

export const mapFinalToAssistantMessage = (
  final: IChatFinalResponse
): IChatMessage => ({
  id: final.assistant_message_id,
  chat_session_id: final.session_id,
  tenant_id: "",
  role: "assistant",
  content: final.answer,
  message_type: "text",
  confidence_score: final.confidence_score,
  rag_metadata: {
    card: final.card,
    citations: final.citations,
    mode: final.mode,
    ...final.rag_metadata,
  },
});

export const normalizeSocketPayload = (
  payload: IChatSocketPayload,
  eventName: string
): IChatSocketPayload => {
  const nested =
    payload.data && typeof payload.data === "object"
      ? (payload.data as IChatSocketPayload)
      : null;

  return {
    session_id: payload.session_id ?? nested?.session_id ?? "",
    message_id: payload.message_id ?? nested?.message_id,
    user_message_id:
      payload.user_message_id ??
      nested?.user_message_id ??
      (payload as { user_message_id?: string }).user_message_id,
    assistant_message_id:
      payload.assistant_message_id ??
      nested?.assistant_message_id ??
      payload.message_id ??
      null,
    status: payload.status ?? nested?.status,
    event: payload.event ?? eventName,
    data: payload.data ?? nested?.data,
    error: payload.error ?? nested?.error,
  };
};

export const placeholderForMode = (mode: TChatMode): string => {
  const map: Record<TChatMode, string> = {
    normal_chat: "Ask a safety question...",
    incident_prevention: "Describe the task you are about to start...",
    image_check: "Upload an image and ask what should be checked...",
  };
  return map[mode];
};
