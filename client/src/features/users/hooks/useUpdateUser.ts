import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { getApiErrorMessage } from "@/lib/api";
import { userService } from "@/services";
import type { IUpdateUserPayload } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateUser = () =>
  useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateUserPayload;
    }) => userService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.users.all });
      toast.success("User updated.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
