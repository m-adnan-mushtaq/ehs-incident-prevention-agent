import { BrandLogo } from "@/components/brand/BrandLogo";
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
    <div className="min-h-screen w-full bg-safety-surface">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden border-r border-safety-outline bg-white lg:block">
          <div className="industrial-grid absolute inset-0 opacity-40" />
          <div className="relative flex min-h-screen flex-col justify-between px-12 py-10">
            <BrandLogo to={ROUTE_PATHS.root} size="md" />

            <div className="max-w-2xl py-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-safety-brand">
                Incident prevention assistant
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-safety-ink">
                AI-powered incident prevention for high-risk field operations.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-safety-muted">
                Turn SOPs, incident history, expert notes, and site rules into
                trusted safety guidance before work starts.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-safety-outline bg-safety-surface px-3 py-2.5"
                  >
                    <MaterialIcon
                      name={icon}
                      className="text-safety-brand"
                    />
                    <span className="text-sm text-safety-ink">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-xl rounded-xl border border-safety-outline bg-safety-panel p-4 shadow-soft">
              <div className="flex items-start justify-between gap-4 border-b border-safety-outline pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-safety-muted">
                    Pre-task safety brief
                  </p>
                  <p className="mt-1 text-sm font-semibold text-safety-ink">
                    Conveyor maintenance, Line 2
                  </p>
                </div>
                <span className="rounded-md border border-safety-amber/30 bg-safety-amber/10 px-2 py-1 text-xs font-semibold text-amber-700">
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
                <div className="flex items-center gap-2 rounded-md bg-safety-success/10 px-3 py-2 text-sm text-safety-success">
                  <MaterialIcon name="verified" className="text-base" />
                  SME Approved
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-safety-muted">
                <MaterialIcon name="warning" className="text-safety-amber" />
                Flagged controls are reviewed before field work begins.
              </div>
            </div>
          </div>
        </section>

        <main className="flex min-h-screen items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="mb-6 flex justify-center lg:hidden">
              <BrandLogo to={ROUTE_PATHS.root} size="md" />
            </div>
            <div className="space-y-8 rounded-xl border border-safety-outline bg-white p-8 shadow-soft">
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
  <div className="rounded-md bg-white px-3 py-2">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-safety-muted">
      {label}
    </p>
    <p className="mt-1 text-sm text-safety-ink">{value}</p>
  </div>
);

export default AuthLayout;
