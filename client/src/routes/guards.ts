import { TOKEN_PREFIX } from "@/constants/common";
import { isAdmin } from "@/lib/user-role";
import { useAuthStore } from "@/store/auth";
import { redirect } from "@tanstack/react-router";
import { ROUTE_PATHS } from "./paths";

export const requireAuth = () => {
  if (!localStorage.getItem(TOKEN_PREFIX)) {
    throw redirect({ to: ROUTE_PATHS.auth.login });
  }
};

export const requireAdmin = () => {
  requireAuth();
  const user = useAuthStore.getState().user;
  if (user && !isAdmin(user)) {
    throw redirect({ to: ROUTE_PATHS.app.root });
  }
};

export const redirectIfAuthenticated = () => {
  if (localStorage.getItem(TOKEN_PREFIX)) {
    throw redirect({ to: ROUTE_PATHS.app.root });
  }
};
