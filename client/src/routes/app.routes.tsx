import DocumentsPage from "@/features/documents";
import SitesPage from "@/features/sites";
import UsersPage from "@/features/users";
import IncidentsPage from "@/features/incidents";
import VoiceKnowledgePage from "@/features/voice-knowledge";
import ChatPage from "@/features/chat";
import AppShellLayout from "@/layout/app-shell";
import { createRoute } from "@tanstack/react-router";
import { requireAdmin, requireAuth } from "./guards";
import { ROUTE_PATHS } from "./paths";
import { rootRoute } from "./root.route";

const AppDashboard = () => (
  <div className="p-8 text-slate-700">
    <h1 className="text-2xl font-semibold text-slate-950">Safety Operations</h1>
    <p className="mt-2 max-w-lg text-sm text-slate-500">
      Select a module from the sidebar to manage sites, field teams, the document
      library, or voice knowledge notes.
    </p>
  </div>
);

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.app.root,
  component: AppShellLayout,
  beforeLoad: requireAuth,
});

export const appIndexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: AppDashboard,
});

export const usersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/users",
  component: UsersPage,
  beforeLoad: requireAdmin,
});

export const sitesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/sites",
  component: SitesPage,
  beforeLoad: requireAdmin,
});

export const documentsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/documents",
  component: DocumentsPage,
  beforeLoad: requireAdmin,
});

export const voiceKnowledgeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/voice-knowledge",
  component: VoiceKnowledgePage,
});

export const incidentsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/incidents",
  component: IncidentsPage,
});

export const chatRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/chat",
  component: ChatPage,
});

export const chatSessionRoute = createRoute({
  getParentRoute: () => chatRoute,
  path: "$sessionId",
  component: ChatPage,
});

export const appRoutes = [
  appIndexRoute,
  usersRoute,
  sitesRoute,
  documentsRoute,
  voiceKnowledgeRoute,
  incidentsRoute,
  chatRoute,
] as const;
