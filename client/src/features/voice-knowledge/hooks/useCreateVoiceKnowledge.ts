import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { getUserRole } from "@/lib/user-role";
import { knowledgeObjectsService } from "@/services";
import type { ICreateKnowledgeObjectPayload } from "@/types/knowledge-object";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateVoiceKnowledge = () =>
  useMutation({
    mutationFn: (payload: ICreateKnowledgeObjectPayload) =>
      knowledgeObjectsService.createKnowledgeObject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.knowledgeObjects.all });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.voiceKnowledge.all });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error) ||
          "Could not save this note. Please check the required fields and try again."
      );
    },
  });

export const getSuccessToastForRole = (role: ReturnType<typeof getUserRole>) => {
  if (role === "sme" || role === "admin") {
    return "Voice note saved as approved knowledge.";
  }
  return "Voice note saved and sent for SME review.";
};
