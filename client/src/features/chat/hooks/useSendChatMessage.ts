import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { chatService } from "@/services";
import type { ISendChatMessagePayload } from "@/types/chat";
import { useMutation } from "@tanstack/react-query";

type SendVars = {
  sessionId: string;
  payload: ISendChatMessagePayload;
};

export const useSendChatMessage = () =>
  useMutation({
    mutationFn: ({ sessionId, payload }: SendVars) =>
      chatService.sendChatMessage(sessionId, payload),
    onSuccess: (_data, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.chat.messages(sessionId),
      });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.chat.sessions });
    },
  });
