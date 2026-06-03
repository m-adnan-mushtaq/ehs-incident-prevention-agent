import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import type {
  IChatFinalResponse,
  IChatMessage,
  TChatMode,
} from "@/types/chat";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  buildOptimisticUserMessage,
  mapFinalToAssistantMessage,
} from "../utils/chat-formatters";
import { CHAT_ERROR_MESSAGE } from "../utils/chat.constants";
import type { ChatLiveAction, IChatLiveState } from "../utils/chat-event-reducer";
import { useCreateChatSession } from "./useCreateChatSession";
import { useSendChatMessage } from "./useSendChatMessage";

type Params = {
  sessionId: string | null;
  composeMode: TChatMode;
  selectedSiteId: string | null;
  openSession: (id: string) => void;
  apiMessages: IChatMessage[];
  liveState: IChatLiveState;
  dispatchLive: (action: ChatLiveAction) => void;
};

export const useChatMessageFlow = ({
  sessionId,
  composeMode,
  selectedSiteId,
  openSession,
  apiMessages,
  liveState,
  dispatchLive,
}: Params) => {
  const [localMessages, setLocalMessages] = useState<IChatMessage[]>([]);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const pendingHttpFinal = useRef<IChatFinalResponse | null>(null);

  const createSession = useCreateChatSession();
  const sendMessage = useSendChatMessage();

  const reconcileFinal = useCallback((final: IChatFinalResponse) => {
    const assistant = mapFinalToAssistantMessage(final);
    setLocalMessages((prev) => {
      const withoutDup = prev.filter((m) => m.id !== assistant.id);
      const hasAssistant = withoutDup.some((m) => m.id === assistant.id);
      return hasAssistant
        ? withoutDup.map((m) => (m.id === assistant.id ? assistant : m))
        : [...withoutDup, assistant];
    });
    queryClient.invalidateQueries({
      queryKey: CACHE_KEYS.chat.messages(final.session_id),
    });
    queryClient.invalidateQueries({ queryKey: CACHE_KEYS.chat.sessions });
  }, []);

  useEffect(() => {
    setLocalMessages([]);
    setInlineError(null);
    pendingHttpFinal.current = null;
  }, [sessionId]);

  useEffect(() => {
    if (!apiMessages.length) return;
    setLocalMessages((prev) => {
      const merged = [...apiMessages];
      prev.forEach((p) => {
        if (p.id.startsWith("temp-") && !merged.some((m) => m.content === p.content))
          merged.push(p);
        if (!merged.some((m) => m.id === p.id)) merged.push(p);
      });
      return merged.sort(
        (a, b) =>
          new Date(a.created_at ?? 0).getTime() -
          new Date(b.created_at ?? 0).getTime()
      );
    });
  }, [apiMessages]);

  useEffect(() => {
    if (!liveState.finalResponse) return;
    const id = liveState.finalResponse.assistant_message_id;
    if (pendingHttpFinal.current?.assistant_message_id === id) {
      pendingHttpFinal.current = null;
      return;
    }
    reconcileFinal(liveState.finalResponse);
  }, [liveState.finalResponse, reconcileFinal]);

  const ensureSession = async (): Promise<string> => {
    if (sessionId) return sessionId;
    const session = await createSession.mutateAsync({
      mode: composeMode,
      site_id: selectedSiteId,
    });
    openSession(session.id);
    return session.id;
  };

  const handleSend = async (
    text: string,
    imageFile: File | null,
    onRestore: (text: string, image: File | null) => void
  ) => {
    const trimmed = text.trim();
    if (!trimmed && !imageFile) return;

    setInlineError(null);
    let sid = sessionId;
    try {
      sid = await ensureSession();
    } catch {
      return;
    }

    const tempId = `temp-${Date.now()}`;
    setLocalMessages((prev) => [
      ...prev,
      buildOptimisticUserMessage(
        sid,
        trimmed || "[Image uploaded for safety review]",
        tempId
      ),
    ]);
    dispatchLive({ type: "start_turn", userMessageId: tempId });

    try {
      const final = await sendMessage.mutateAsync({
        sessionId: sid,
        payload: { message: trimmed || undefined, image: imageFile },
      });
      pendingHttpFinal.current = final;
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, id: final.user_message_id } : m))
      );
      dispatchLive({
        type: "attach_turn",
        userMessageId: final.user_message_id,
        assistantMessageId: final.assistant_message_id,
      });
      if (
        !liveState.finalResponse ||
        liveState.finalResponse.assistant_message_id !== final.assistant_message_id
      ) {
        reconcileFinal(final);
        dispatchLive({ type: "final", response: final });
      }
    } catch (err) {
      onRestore(trimmed, imageFile);
      const msg = getApiErrorMessage(err) || CHAT_ERROR_MESSAGE;
      setInlineError(msg);
      toast.error(msg);
    }
  };

  return {
    localMessages,
    setLocalMessages,
    inlineError,
    setInlineError,
    reconcileFinal,
    handleSend,
    sending: sendMessage.isPending,
    creating: createSession.isPending,
  };
};
