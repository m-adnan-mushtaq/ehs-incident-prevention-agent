import { AppSidebar } from "@/components/app-sidebar";
import NavBar from "@/components/layout/navbar";
import ScreenLoader from "@/components/layout/screen-loader";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ROUTE_PATHS } from "@/routes/paths";
import { useAuthStore } from "@/store/auth";
import { Menu } from "lucide-react";
import { Navigate, Outlet } from "@tanstack/react-router";

const AppShellLayout = () => {
  const sessionActive = useAuthStore((s) => s.sessionActive);
  const { user, isLoading, isFetching } = useCurrentUser();

  if (!sessionActive) {
    return <Navigate to={ROUTE_PATHS.auth.login} replace />;
  }

  if (isLoading || isFetching) {
    return <ScreenLoader />;
  }

  if (!user) {
    return <Navigate to={ROUTE_PATHS.auth.login} replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="max-w-full overflow-auto bg-safety-surface">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-safety-outline bg-white/95 backdrop-blur">
          <div className="flex w-full items-center px-4 lg:hidden">
            <SidebarTrigger className="text-safety-ink">
              <Menu />
            </SidebarTrigger>
          </div>
          <NavBar />
        </header>
        <main className="min-h-0 flex-1 overflow-auto p-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShellLayout;
