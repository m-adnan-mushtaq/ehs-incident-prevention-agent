import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { sitesService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteSite = () =>
  useMutation({
    mutationFn: (id: string) => sitesService.deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.sites.all });
      toast.success("Site archived.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
