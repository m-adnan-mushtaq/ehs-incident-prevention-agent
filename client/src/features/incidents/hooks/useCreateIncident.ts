import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { incidentsService } from "@/services";
import type { ICreateIncidentPayload } from "@/types/incident";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateIncident = () =>
  useMutation({
    mutationFn: (payload: ICreateIncidentPayload) =>
      incidentsService.createIncident(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.incidents.all });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.knowledgeObjects.all });
      toast.success(
        "Incident reported successfully. This incident will be processed for future safety learning."
      );
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(error) ||
          "Could not report incident. Please check the details and try again."
      ),
  });
