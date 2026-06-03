import AdminSignupPage from "@/features/auth/admin-signup";
import AuthLayout from "@/features/auth/layout";
import LoginPage from "@/features/auth/login";
import { createRoute } from "@tanstack/react-router";
import { ROUTE_PATHS } from "./paths";
import { rootRoute } from "./root.route";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.auth.root,
  component: AuthLayout,
});

export const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/login",
  component: LoginPage,
});

export const adminSignupRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/admin-signup",
  component: AdminSignupPage,
});

export const authRoutes = [loginRoute, adminSignupRoute] as const;
