import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { knowledgeObjectsService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useApproveVoiceKnowledge = () =>
  useMutation({
    mutationFn: (id: string) =>
      knowledgeObjectsService.updateKnowledgeObject(id, { status: "approved" }),
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.knowledgeObjects.all });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.voiceKnowledge.all });
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.knowledgeObjects.detail(note.id),
      });
      toast.success("Voice note approved.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error) || "Could not approve this note. Please try again."
      );
    },
  });
