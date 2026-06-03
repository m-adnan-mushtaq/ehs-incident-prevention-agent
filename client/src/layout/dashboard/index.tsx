import { AppSidebar } from "@/components/app-sidebar";
import NavBar from "@/components/layout/navbar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth";
import { Menu } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router";

const DashboardLayout = () => {
  const user = useAuthStore((store) => store.user);
  const location = useLocation();

  if (!user)
    return (
      <Navigate
        replace
        to="/"
        state={{
          prevUrl: location.pathname,
        }}
      />
    );
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="max-w-full overflow-auto">
        <header className="flex bg-muted/50 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full max-w-[100vw] min-h-[5.625rem] p-0">
            <div className="flex items-center lg:hidden ">
              <SidebarTrigger className="ml-1">
                <Menu />
              </SidebarTrigger>
            </div>
            <NavBar />
          </div>
        </header>
        <div className="h-[calc(100vh-5.625rem)] overflow-auto min-h-[calc(100vh-5.625rem)] max-h-[calc(100vh-5.625rem] flex-1 bg-[#f8f8f8] rounded-xl md:min-h-min">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
