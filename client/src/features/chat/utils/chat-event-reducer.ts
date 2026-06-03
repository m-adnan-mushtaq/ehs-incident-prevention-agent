import type { IChatFinalResponse, IChatSocketPayload } from "@/types/chat";
import { TOOL_STATUS_LABELS } from "./chat.constants";
import { normalizeSocketPayload } from "./chat-formatters";

export interface IToolTimelineItem {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
}

export interface IChatLiveState {
  activeTurnUserMessageId: string | null;
  activeTurnAssistantMessageId: string | null;
  thinkingMessage: string | null;
  toolEvents: IToolTimelineItem[];
  streamingText: string;
  finalResponse: IChatFinalResponse | null;
  isStreaming: boolean;
  error: string | null;
}

export const initialChatLiveState: IChatLiveState = {
  activeTurnUserMessageId: null,
  activeTurnAssistantMessageId: null,
  thinkingMessage: null,
  toolEvents: [],
  streamingText: "",
  finalResponse: null,
  isStreaming: false,
  error: null,
};

const toolKeyFromStatus = (status: string): string => {
  if (status.includes("image")) return "image_analysis";
  if (status.includes("retrieval") || status.includes("guidance"))
    return "official_guidance";
  if (status.includes("incident")) return "similar_incidents";
  if (status.includes("expert") || status.includes("knowledge"))
    return "expert_knowledge";
  if (status === "completed" || status.includes("answer")) return "answer";
  return status;
};

const upsertTool = (
  items: IToolTimelineItem[],
  key: string,
  label: string,
  status: IToolTimelineItem["status"]
): IToolTimelineItem[] => {
  const idx = items.findIndex((t) => t.id === key);
  const entry = { id: key, label, status };
  if (idx >= 0) {
    const next = [...items];
    next[idx] = entry;
    return next;
  }
  return [...items, entry];
};

export type ChatLiveAction =
  | { type: "reset" }
  | { type: "start_turn"; userMessageId: string; assistantMessageId?: string | null }
  | {
      type: "attach_turn";
      userMessageId: string;
      assistantMessageId?: string | null;
    }
  | { type: "socket_event"; event: string; payload: IChatSocketPayload }
  | { type: "token"; token: string }
  | { type: "final"; response: IChatFinalResponse }
  | { type: "error"; message: string };

export const chatLiveReducer = (
  state: IChatLiveState,
  action: ChatLiveAction
): IChatLiveState => {
  switch (action.type) {
    case "reset":
      return { ...initialChatLiveState };
    case "start_turn":
      return {
        ...initialChatLiveState,
        activeTurnUserMessageId: action.userMessageId,
        activeTurnAssistantMessageId: action.assistantMessageId ?? null,
        isStreaming: true,
        thinkingMessage: "Processing your safety request...",
      };
    case "attach_turn":
      return {
        ...state,
        activeTurnUserMessageId: action.userMessageId,
        activeTurnAssistantMessageId:
          action.assistantMessageId ?? state.activeTurnAssistantMessageId,
        isStreaming: true,
      };
    case "token":
      return {
        ...state,
        isStreaming: true,
        streamingText: state.streamingText + action.token,
        thinkingMessage: null,
      };
    case "final":
      return {
        ...state,
        finalResponse: action.response,
        activeTurnAssistantMessageId: action.response.assistant_message_id,
        isStreaming: false,
        thinkingMessage: null,
        streamingText: action.response.answer,
        toolEvents: state.toolEvents.map((t) => ({ ...t, status: "done" as const })),
      };
    case "error":
      return {
        ...state,
        error: action.message,
        isStreaming: false,
        thinkingMessage: null,
        toolEvents: state.toolEvents.map((t) =>
          t.status === "active" ? { ...t, status: "error" as const } : t
        ),
      };
    case "socket_event": {
      const p = normalizeSocketPayload(action.payload, action.event);
      const status = String(p.status ?? "");
      const thinking =
        TOOL_STATUS_LABELS[status] ??
        (typeof p.data === "string" ? p.data : null);

      if (action.event.includes("thinking") && thinking) {
        return { ...state, thinkingMessage: thinking, isStreaming: true };
      }

      if (action.event.includes("token")) {
        const token =
          typeof p.data === "string"
            ? p.data
            : String((p.data as { token?: string })?.token ?? "");
        if (!token) return state;
        return {
          ...state,
          streamingText: state.streamingText + token,
          isStreaming: true,
          thinkingMessage: null,
        };
      }

      if (
        action.event.includes("tool") ||
        action.event === "chat_tool_status"
      ) {
        const label = TOOL_STATUS_LABELS[status] ?? status.replace(/_/g, " ");
        const key = toolKeyFromStatus(status);
        const done = status.includes("completed");
        return {
          ...state,
          isStreaming: true,
          thinkingMessage: null,
          toolEvents: upsertTool(
            state.toolEvents,
            key,
            label,
            done ? "done" : "active"
          ),
          activeTurnAssistantMessageId:
            p.assistant_message_id ?? p.message_id ?? state.activeTurnAssistantMessageId,
        };
      }

      if (
        action.event.includes("progress") ||
        action.event.includes("message_created")
      ) {
        return {
          ...state,
          isStreaming: true,
          activeTurnUserMessageId:
            p.user_message_id ?? state.activeTurnUserMessageId,
          activeTurnAssistantMessageId:
            p.assistant_message_id ?? p.message_id ?? state.activeTurnAssistantMessageId,
          thinkingMessage: thinking ?? state.thinkingMessage,
        };
      }

      if (action.event.includes("final") && p.data) {
        const data = p.data as IChatFinalResponse;
        return chatLiveReducer(state, { type: "final", response: data });
      }

      if (action.event.includes("error")) {
        const msg =
          p.error ??
          (typeof p.data === "object" &&
          p.data &&
          "error" in (p.data as object)
            ? String((p.data as { error?: string }).error)
            : null);
        return chatLiveReducer(state, {
          type: "error",
          message: msg ?? "Safety check failed",
        });
      }

      return state;
    }
    default:
      return state;
  }
};
