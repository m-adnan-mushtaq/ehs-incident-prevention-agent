import { CACHE_KEYS } from "@/constants/common";
import { authService } from "@/services";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useCurrentUser = () => {
  const { user, setUser, resetUser, sessionActive } = useAuthStore();

  const query = useQuery({
    queryKey: CACHE_KEYS.auth.me,
    queryFn: authService.getCurrentUser,
    enabled: sessionActive,
    retry: false,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
    if (query.isError && sessionActive) resetUser();
  }, [query.data, query.isError, sessionActive, setUser, resetUser]);

  return { user: query.data ?? user, ...query };
};
