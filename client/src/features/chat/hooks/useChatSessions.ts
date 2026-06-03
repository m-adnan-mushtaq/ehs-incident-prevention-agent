import { CACHE_KEYS } from "@/constants/common";
import { chatService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useChatSessions = () =>
  useQuery({
    queryKey: CACHE_KEYS.chat.sessions,
    queryFn: chatService.getChatSessions,
  });
