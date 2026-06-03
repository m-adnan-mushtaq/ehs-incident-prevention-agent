import { CACHE_KEYS } from "@/constants/common";
import { knowledgeObjectsService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useVoiceKnowledgeDetail = (id: string | null) =>
  useQuery({
    queryKey: CACHE_KEYS.knowledgeObjects.detail(id ?? ""),
    queryFn: () => knowledgeObjectsService.getKnowledgeObjectById(id!),
    enabled: Boolean(id),
  });
