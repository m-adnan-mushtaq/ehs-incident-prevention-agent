import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { userService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteUser = () =>
  useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.users.all });
      toast.success("User removed from the organization.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
