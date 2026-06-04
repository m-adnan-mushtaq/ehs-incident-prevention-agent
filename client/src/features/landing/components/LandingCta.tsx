import { BrandPanel } from "@/components/brand/BrandPanel";
import { ROUTE_PATHS } from "@/routes/paths";
import { Link } from "@tanstack/react-router";

export const LandingCta = () => (
  <BrandPanel as="section" className="py-20 text-center">
    <div className="mx-auto max-w-3xl space-y-8 px-6">
      <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl lg:leading-tight">
        Give every team trusted safety guidance before work starts
      </h2>
      <p className="text-lg text-slate-300">
        Start with your organization admin account and connect your safety
        knowledge in minutes.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to={ROUTE_PATHS.auth.adminSignup}
          className="rounded-lg bg-safety-brand px-10 py-4 text-lg font-bold text-white shadow-xl shadow-blue-900/40 transition-all hover:bg-blue-600"
        >
          Sign Up
        </Link>
        <Link
          to={ROUTE_PATHS.auth.login}
          className="rounded-lg border border-white/25 bg-white/10 px-10 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15"
        >
          Sign In
        </Link>
      </div>
    </div>
  </BrandPanel>
);
