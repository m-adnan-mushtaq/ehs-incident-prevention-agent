import { ROUTE_PATHS } from "@/routes/paths";
import type { INavLink } from "@/types";
import type { UserRole } from "@/types/user";
import {
  Building2,
  FileText,
  LayoutDashboard,
  Mic,
  Users,
} from "lucide-react";

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

const adminNav: INavLink[] = [
  { title: "Dashboard", url: ROUTE_PATHS.app.root, icon: LayoutDashboard },
  { title: "Sites", url: ROUTE_PATHS.app.sites, icon: Building2 },
  { title: "Field Teams", url: ROUTE_PATHS.app.users, icon: Users },
  { title: "Document Library", url: ROUTE_PATHS.app.documents, icon: FileText },
  voiceNavItem,
];

const smeNav: INavLink[] = [
  { title: "Dashboard", url: ROUTE_PATHS.app.root, icon: LayoutDashboard },
  voiceNavItem,
];

const fieldWorkerNav: INavLink[] = [
  { title: "Dashboard", url: ROUTE_PATHS.app.root, icon: LayoutDashboard },
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
