import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { incidentsService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteIncident = () =>
  useMutation({
    mutationFn: (id: string) => incidentsService.deleteIncident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.incidents.all });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.knowledgeObjects.all });
      toast.success("Incident archived successfully.");
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(error) ||
          "Could not archive incident. You may not have permission for this action."
      ),
  });
