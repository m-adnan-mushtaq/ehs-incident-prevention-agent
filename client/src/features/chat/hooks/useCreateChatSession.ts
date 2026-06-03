import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { chatService } from "@/services";
import type { ICreateChatSessionPayload } from "@/types/chat";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateChatSession = () =>
  useMutation({
    mutationFn: (payload: ICreateChatSessionPayload) =>
      chatService.createChatSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.chat.sessions });
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(error) || "Could not start a new safety chat."
      ),
  });
