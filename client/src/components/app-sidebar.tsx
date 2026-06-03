import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNavLinksForRole } from "@/config/navigation";
import { ROUTE_PATHS } from "@/routes/paths";
import { getUserRole } from "@/lib/user-role";
import { useAuthStore } from "@/store/auth";
import { Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const user = useAuthStore((s) => s.user);
  const navLinks = getNavLinksForRole(getUserRole(user));

  return (
    <Sidebar
      className="border-r border-slate-200 bg-white text-slate-700"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="border-b border-slate-200 bg-white px-4 py-5">
        <Link to={ROUTE_PATHS.app.root} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-700">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-slate-950">
              Safety Operations
            </span>
            <span className="text-xs text-slate-500">EHS Platform</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain showLabel items={navLinks} />
      </SidebarContent>
      <SidebarFooter className="bg-white" />
      <SidebarRail />
    </Sidebar>
  );
};
