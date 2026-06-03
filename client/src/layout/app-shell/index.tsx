import { AppSidebar } from "@/components/app-sidebar";
import NavBar from "@/components/layout/navbar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import ScreenLoader from "@/components/layout/screen-loader";
import { TOKEN_PREFIX } from "@/constants/common";
import { ROUTE_PATHS } from "@/routes/paths";
import { Menu } from "lucide-react";
import { Outlet, redirect, useRouterState } from "@tanstack/react-router";

const AppShellLayout = () => {
  const { user, isLoading, isFetching } = useCurrentUser();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!localStorage.getItem(TOKEN_PREFIX)) {
    throw redirect({ to: ROUTE_PATHS.auth.login, search: { redirect: pathname } });
  }

  if (isLoading || isFetching) {
    return <ScreenLoader />;
  }

  if (!user) {
    throw redirect({ to: ROUTE_PATHS.auth.login });
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="max-w-full overflow-auto bg-[#0c1424]">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800/80 bg-[#0f1729]">
          <div className="flex w-full items-center px-4 lg:hidden">
            <SidebarTrigger className="text-slate-300">
              <Menu />
            </SidebarTrigger>
          </div>
          <NavBar />
        </header>
        <main className="flex-1 overflow-auto p-0 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShellLayout;
