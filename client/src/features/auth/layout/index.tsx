import { BrandLogo } from "@/components/brand/BrandLogo";
import { BrandPanel, BrandPanelBackdrop } from "@/components/brand/BrandPanel";
import { MaterialIcon } from "@/components/brand/MaterialIcon";
import { ROUTE_PATHS } from "@/routes/paths";
import { useAuthStore } from "@/store/auth";
import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";

const benefits = [
  { icon: "check_circle", label: "Site-aware safety answers" },
  { icon: "verified", label: "SME-reviewed knowledge" },
  { icon: "menu_book", label: "Cited guidance from approved sources" },
  { icon: "photo_camera", label: "Field image hazard checks" },
  { icon: "fact_check", label: "Audit-ready safety operations" },
] as const;

const AuthLayout = () => {
  const user = useAuthStore((s) => s.user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (user) {
    return <Navigate to={ROUTE_PATHS.app.root} replace />;
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <BrandPanel
          as="section"
          className="relative hidden lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10"
        >
          <BrandLogo to={ROUTE_PATHS.root} size="md" variant="inverse" />

          <div className="max-w-2xl py-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
              Incident prevention assistant
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
              AI-powered incident prevention for high-risk field operations.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Turn SOPs, incident history, expert notes, and site rules into
              trusted safety guidance before work starts.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {benefits.map(({ icon, label }) => (
                <div
                  key={label}
                  className="glass-panel flex items-center gap-3 rounded-xl px-3 py-2.5"
                >
                  <MaterialIcon name={icon} className="text-blue-300" />
                  <span className="text-sm text-slate-100">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel max-w-xl rounded-xl p-4 shadow-panel">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Pre-task safety brief
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Conveyor maintenance, Line 2
                </p>
              </div>
              <span className="rounded-md border border-amber-400/40 bg-amber-400/15 px-2 py-1 text-xs font-semibold text-amber-200">
                Risk Level: High
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PreviewRow
                label="Required PPE"
                value="Gloves, eye protection, lockout kit"
              />
              <PreviewRow
                label="Stop-Work Triggers"
                value="Unexpected motion or missing guard"
              />
              <PreviewRow label="Sources" value="3 approved references" />
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">
                <MaterialIcon name="verified" className="text-base" />
                SME Approved
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <MaterialIcon name="warning" className="text-amber-300" />
              Flagged controls are reviewed before field work begins.
            </div>
          </div>
        </BrandPanel>

        <main className="relative flex min-h-screen items-center justify-center bg-safety-surface px-4 py-8">
          <div className="brand-panel-dark absolute inset-0 lg:hidden">
            <BrandPanelBackdrop />
          </div>
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-6 flex justify-center lg:hidden">
              <BrandLogo to={ROUTE_PATHS.root} size="md" variant="inverse" />
            </div>
            <div className="space-y-8 rounded-2xl border border-safety-outline bg-white p-8 shadow-panel lg:shadow-soft">
              <Outlet />
              {pathname === ROUTE_PATHS.auth.login && (
                <p className="text-center text-sm text-safety-muted">
                  New organization?{" "}
                  <Link
                    to={ROUTE_PATHS.auth.adminSignup}
                    className="font-medium text-safety-brand hover:text-blue-700"
                  >
                    Create admin account
                  </Link>
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const PreviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md bg-white/5 px-3 py-2">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm text-slate-100">{value}</p>
  </div>
);

export default AuthLayout;
