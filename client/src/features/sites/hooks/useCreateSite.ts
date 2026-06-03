import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { sitesService } from "@/services";
import type { ICreateSitePayload } from "@/types/site";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateSite = () =>
  useMutation({
    mutationFn: (payload: ICreateSitePayload) => sitesService.createSite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.sites.all });
      toast.success("Site created.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
