import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { incidentsService } from "@/services";
import type { IUpdateIncidentPayload } from "@/types/incident";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateIncident = () =>
  useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateIncidentPayload;
    }) => incidentsService.updateIncident(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.incidents.all });
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.incidents.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.knowledgeObjects.all });
      toast.success("Incident updated successfully.");
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(error) ||
          "Could not update incident. Please check the details and try again."
      ),
  });
