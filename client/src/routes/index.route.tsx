import { TOKEN_PREFIX } from "@/constants/common";
import { createRoute, redirect } from "@tanstack/react-router";
import { ROUTE_PATHS } from "./paths";
import { rootRoute } from "./root.route";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.root,
  beforeLoad: () => {
    const token = localStorage.getItem(TOKEN_PREFIX);
    throw redirect({
      to: token ? ROUTE_PATHS.app.root : ROUTE_PATHS.auth.login,
    });
  },
});
