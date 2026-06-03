import ScreenLoader from "@/components/layout/screen-loader";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree";

export const router = createRouter({
  routeTree,
  defaultPendingComponent: ScreenLoader,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
