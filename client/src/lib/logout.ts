import queryClient from "@/config/query-client";
import { ROUTE_PATHS } from "@/routes/paths";
import { useAuthStore } from "@/store/auth";

let loggingOut = false;

export const shouldSkipAuthInterceptor = () =>
  loggingOut || !useAuthStore.getState().sessionActive;

type LogoutNavigate = (options: {
  to: string;
  replace?: boolean;
}) => void | Promise<void>;

export const performLogout = async (navigate: LogoutNavigate) => {
  if (loggingOut) return;

  loggingOut = true;
  try {
    await queryClient.cancelQueries();
    useAuthStore.getState().resetUser();
    queryClient.clear();
    await navigate({ to: ROUTE_PATHS.root, replace: true });
  } finally {
    loggingOut = false;
  }
};
