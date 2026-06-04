import { TOKEN_PREFIX } from "@/constants/common";
import LandingPage from "@/features/landing";
import { createRoute, redirect } from "@tanstack/react-router";
import { ROUTE_PATHS } from "./paths";
import { rootRoute } from "./root.route";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.root,
  component: LandingPage,
  beforeLoad: () => {
    const token = localStorage.getItem(TOKEN_PREFIX);
    if (token) {
      throw redirect({ to: ROUTE_PATHS.app.root });
    }
  },
});
