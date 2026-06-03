import { ROUTE_PATHS } from "@/routes/paths";
import type { INavLink } from "@/types";
import type { UserRole } from "@/types/user";
import {
  AlertTriangle,
  Building2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Mic,
  Users,
} from "lucide-react";

const safetyAssistantNav: INavLink = {
  title: "Safety Assistant",
  url: ROUTE_PATHS.app.chat,
  icon: MessageSquare,
};

const voiceNavItem: INavLink = {
  title: "Voice Knowledge Notes",
  url: ROUTE_PATHS.app.voiceKnowledge,
  icon: Mic,
};

const fieldWorkerVoiceNav: INavLink = {
  title: "Record Safety Note",
  url: ROUTE_PATHS.app.voiceKnowledge,
  icon: Mic,
};

const incidentsNavItem: INavLink = {
  title: "Incidents",
  url: ROUTE_PATHS.app.incidents,
  icon: AlertTriangle,
};

const fieldWorkerIncidentsNav: INavLink = {
  title: "Report Incident",
  url: ROUTE_PATHS.app.incidents,
  icon: AlertTriangle,
};

const adminNav: INavLink[] = [
  { title: "Dashboard", url: ROUTE_PATHS.app.root, icon: LayoutDashboard },
  safetyAssistantNav,
  { title: "Sites", url: ROUTE_PATHS.app.sites, icon: Building2 },
  { title: "Field Teams", url: ROUTE_PATHS.app.users, icon: Users },
  { title: "Document Library", url: ROUTE_PATHS.app.documents, icon: FileText },
  incidentsNavItem,
  voiceNavItem,
];

const smeNav: INavLink[] = [
  { title: "Dashboard", url: ROUTE_PATHS.app.root, icon: LayoutDashboard },
  safetyAssistantNav,
  incidentsNavItem,
  voiceNavItem,
];

const fieldWorkerNav: INavLink[] = [
  { title: "Dashboard", url: ROUTE_PATHS.app.root, icon: LayoutDashboard },
  safetyAssistantNav,
  fieldWorkerIncidentsNav,
  fieldWorkerVoiceNav,
];

export const getNavLinksForRole = (role: UserRole | null): INavLink[] => {
  switch (role) {
    case "admin":
      return adminNav;
    case "sme":
      return smeNav;
    case "field_worker":
      return fieldWorkerNav;
    default:
      return [];
  }
};
