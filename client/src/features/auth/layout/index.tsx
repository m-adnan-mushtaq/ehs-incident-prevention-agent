import { ROUTE_PATHS } from "@/routes/paths";
import { useAuthStore } from "@/store/auth";
import { Shield } from "lucide-react";
import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";

const AuthLayout = () => {
  const user = useAuthStore((s) => s.user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (user) {
    return <Navigate to={ROUTE_PATHS.app.root} replace />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#060b14] px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-800/80 bg-[#0c1424] p-8 shadow-xl shadow-black/20">
        <div className="text-center">
          <Link to={ROUTE_PATHS.auth.login} className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-600/20 text-sky-400">
              <Shield className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold text-slate-100">
                Safety Operations
              </p>
              <p className="text-xs text-slate-500">EHS Incident Prevention</p>
            </div>
          </Link>
        </div>
        <Outlet />
        {pathname === ROUTE_PATHS.auth.login && (
          <p className="text-center text-sm text-slate-500">
            New organization?{" "}
            <Link
              to={ROUTE_PATHS.auth.adminSignup}
              className="font-medium text-sky-400 hover:text-sky-300"
            >
              Create admin account
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
