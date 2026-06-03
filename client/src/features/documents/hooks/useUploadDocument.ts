import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { documentsService } from "@/services";
import type { IUploadDocumentPayload } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUploadDocument = () =>
  useMutation({
    mutationFn: (payload: IUploadDocumentPayload) =>
      documentsService.uploadDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.documents.all });
      toast.success("Document uploaded and queued for processing.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
