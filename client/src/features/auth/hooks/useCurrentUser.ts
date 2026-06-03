import { CACHE_KEYS, TOKEN_PREFIX } from "@/constants/common";
import { authService } from "@/services";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useCurrentUser = () => {
  const { user, setUser, resetUser } = useAuthStore();
  const hasToken = Boolean(localStorage.getItem(TOKEN_PREFIX));

  const query = useQuery({
    queryKey: CACHE_KEYS.auth.me,
    queryFn: authService.getCurrentUser,
    enabled: hasToken,
    retry: false,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
    if (query.isError) resetUser();
  }, [query.data, query.isError, setUser, resetUser]);

  return { user: query.data ?? user, ...query };
};
