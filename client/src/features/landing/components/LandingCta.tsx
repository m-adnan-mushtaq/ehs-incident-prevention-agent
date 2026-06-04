import { ROUTE_PATHS } from "@/routes/paths";
import { Link } from "@tanstack/react-router";

export const LandingCta = () => (
  <section className="relative overflow-hidden bg-safety-ink py-16 text-center text-white">
    <div className="industrial-grid absolute inset-0 opacity-10" />
    <div className="relative z-10 mx-auto max-w-4xl space-y-8 px-6">
      <h2 className="text-3xl font-bold md:text-5xl lg:text-[56px] lg:leading-[64px]">
        Give every team access to trusted safety guidance before work starts
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to={ROUTE_PATHS.auth.adminSignup}
          className="rounded-lg bg-safety-brand px-12 py-4 text-lg font-bold text-white shadow-xl shadow-safety-brand/20 transition-all hover:bg-blue-700"
        >
          Sign Up
        </Link>
        <Link
          to={ROUTE_PATHS.auth.login}
          className="rounded-lg bg-white px-12 py-4 text-lg font-bold text-safety-ink transition-all hover:bg-safety-surface"
        >
          Sign In
        </Link>
      </div>
    </div>
  </section>
);
