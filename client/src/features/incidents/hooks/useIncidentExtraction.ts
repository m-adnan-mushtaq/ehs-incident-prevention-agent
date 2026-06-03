import { incidentsService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useIncidentExtraction = () =>
  useMutation({
    mutationFn: (audioBlob: Blob) =>
      incidentsService.extractVoiceIncident(audioBlob),
    onError: () => {
      toast.error("Failed to extract incident details. Please try again.");
    },
  });
