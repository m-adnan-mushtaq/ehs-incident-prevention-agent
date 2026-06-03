import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { sitesService } from "@/services";
import type { IUpdateSitePayload } from "@/types/site";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateSite = () =>
  useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateSitePayload }) =>
      sitesService.updateSite(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.sites.all });
      toast.success("Site updated.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
