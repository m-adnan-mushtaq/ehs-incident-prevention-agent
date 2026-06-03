import { CACHE_KEYS } from "@/constants/common";
import { chatService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useChatMessages = (sessionId: string | null) =>
  useQuery({
    queryKey: CACHE_KEYS.chat.messages(sessionId ?? ""),
    queryFn: () => chatService.getChatMessages(sessionId!),
    enabled: Boolean(sessionId),
  });
