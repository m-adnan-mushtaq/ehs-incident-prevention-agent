import { CACHE_KEYS } from "@/constants/common";
import { incidentsService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useIncidentDetail = (id: string | null) =>
  useQuery({
    queryKey: CACHE_KEYS.incidents.detail(id ?? ""),
    queryFn: () => incidentsService.getIncidentById(id!),
    enabled: Boolean(id),
  });
