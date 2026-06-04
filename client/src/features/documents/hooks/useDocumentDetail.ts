import { CACHE_KEYS } from "@/constants/common";
import { documentsService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useDocumentDetail = (id: string | null) =>
  useQuery({
    queryKey: CACHE_KEYS.documents.detail(id ?? ""),
    queryFn: () => documentsService.getDocumentById(id!),
    enabled: Boolean(id),
  });
