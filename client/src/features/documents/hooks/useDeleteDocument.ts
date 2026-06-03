import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { documentsService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteDocument = () =>
  useMutation({
    mutationFn: (id: string) => documentsService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.documents.all });
      toast.success("Document archived.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
