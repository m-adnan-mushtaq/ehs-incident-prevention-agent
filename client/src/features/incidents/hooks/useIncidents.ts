import { CACHE_KEYS } from "@/constants/common";
import type { PaginationParams } from "@/components/hoc/withPaginatedQuery";
import { incidentsService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useIncidents = (params: PaginationParams, enabled = true) =>
  useQuery({
    queryKey: CACHE_KEYS.incidents.paginated(params),
    queryFn: () => incidentsService.getIncidents(params),
    enabled,
  });
