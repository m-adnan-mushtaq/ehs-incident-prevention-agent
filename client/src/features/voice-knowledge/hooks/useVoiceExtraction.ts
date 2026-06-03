import { voiceKnowledgeService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/api";

export const useVoiceExtraction = () =>
  useMutation({
    mutationFn: (audioBlob: Blob) => voiceKnowledgeService.extractVoiceKnowledge(audioBlob),
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error) ||
          "Could not extract structured knowledge from this recording. You can re-record and try again."
      );
    },
  });
