import queryClient from "@/config/query-client";
import { CACHE_KEYS, TOKEN_PREFIX } from "@/constants/common";
import type { ILoginPayload } from "@/types/auth";
import { authService } from "@/services";
import { apiInstance } from "@/services/_base";
import { useAuthStore } from "@/store/auth";
import { getUserRole } from "@/lib/user-role";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/api";
import { ROUTE_PATHS } from "@/routes/paths";

const getPostLoginPath = (role: ReturnType<typeof getUserRole>) => {
  if (role === "admin") return ROUTE_PATHS.app.documents;
  if (role === "field_worker" || role === "sme") {
    return ROUTE_PATHS.app.voiceKnowledge;
  }
  return ROUTE_PATHS.app.root;
};

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ILoginPayload) => authService.login(data),
    onSuccess: async (result) => {
      const token = result.tokens.access.token;
      localStorage.setItem(TOKEN_PREFIX, token);
      apiInstance.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(result.user);
      await queryClient.invalidateQueries({ queryKey: CACHE_KEYS.auth.me });
      toast.success("Signed in successfully.");
      const role = getUserRole(result.user);
      navigate({ to: getPostLoginPath(role) });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
