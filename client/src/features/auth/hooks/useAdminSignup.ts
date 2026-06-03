import queryClient from "@/config/query-client";
import { CACHE_KEYS, TOKEN_PREFIX } from "@/constants/common";
import type { IAdminSignupPayload } from "@/types/auth";
import { authService } from "@/services";
import { apiInstance } from "@/services/_base";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/api";
import { ROUTE_PATHS } from "@/routes/paths";

export const useAdminSignup = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: IAdminSignupPayload) => authService.signup(data),
    onSuccess: async (result) => {
      const token = result.tokens.access.token;
      localStorage.setItem(TOKEN_PREFIX, token);
      apiInstance.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(result.user);
      await queryClient.invalidateQueries({ queryKey: CACHE_KEYS.auth.me });
      toast.success("Organization account created. Welcome to Safety Operations.");
      navigate({ to: ROUTE_PATHS.app.documents });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
