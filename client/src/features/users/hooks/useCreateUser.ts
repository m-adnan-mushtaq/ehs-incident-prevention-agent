import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { userService } from "@/services";
import type { ICreateUserPayload } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateUser = () =>
  useMutation({
    mutationFn: (payload: ICreateUserPayload) => userService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.users.all });
      toast.success("User added to field teams.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
