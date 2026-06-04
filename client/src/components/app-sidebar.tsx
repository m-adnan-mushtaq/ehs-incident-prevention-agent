import { BrandLogo } from "@/components/brand/BrandLogo";
import { MaterialIcon } from "@/components/brand/MaterialIcon";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { getNavLinksForRole } from "@/config/navigation";
import { ROUTE_PATHS } from "@/routes/paths";
import { getUserRole, roleLabel } from "@/lib/user-role";
import { useAuthStore } from "@/store/auth";
import UserAvatar from "@/components/layout/user-avatar";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const user = useAuthStore((s) => s.user);
  const navLinks = getNavLinksForRole(getUserRole(user));

  return (
    <Sidebar
      className="border-sidebar-border bg-sidebar text-sidebar-foreground"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-5">
        <BrandLogo to={ROUTE_PATHS.app.root} size="sm" variant="inverse" />
      </SidebarHeader>
      <SidebarContent className="bg-sidebar px-2 py-3">
        <div className="mb-3 rounded-lg border border-sidebar-border bg-white/5 px-3 py-2 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MaterialIcon name="corporate_fare" className="text-sm text-blue-300" />
            Tenant
          </div>
          <p className="mt-1 truncate text-sm font-medium text-white">
            {user?.tenant?.name ?? "Safety Operations"}
          </p>
        </div>
        <NavMain showLabel items={navLinks} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-3">
        <div className="flex items-center gap-3 rounded-lg border border-sidebar-border bg-white/5 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1.5">
          <UserAvatar user={user} />
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-white">
              {user?.name}
            </p>
            <Badge
              variant="outline"
              className="mt-1 border-white/15 bg-white/10 text-[10px] text-slate-300"
            >
              {roleLabel[getUserRole(user) ?? "field_worker"] ?? "User"}
            </Badge>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
