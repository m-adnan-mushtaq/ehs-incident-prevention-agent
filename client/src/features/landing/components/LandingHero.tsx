import { MaterialIcon } from "@/components/brand/MaterialIcon";
import { ROUTE_PATHS } from "@/routes/paths";
import { HERO_TRUST_BADGES } from "@/features/landing/constants";
import { Link } from "@tanstack/react-router";

export const LandingHero = () => (
  <section className="relative overflow-hidden bg-white pb-16 pt-24">
    <div className="relative z-10 mx-auto max-w-[1440px] space-y-8 px-6 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-safety-brand/10 bg-safety-panel px-4 py-1.5">
        <span className="flex h-2 w-2 rounded-full bg-safety-brand" />
        <span className="text-xs font-bold uppercase tracking-wider text-safety-brand">
          Enterprise-Grade Safety Intelligence
        </span>
      </div>
      <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-safety-ink md:text-5xl lg:text-[56px] lg:leading-[64px]">
        Turn scattered safety knowledge into real-time incident prevention
      </h1>
      <p className="mx-auto max-w-3xl text-lg text-safety-muted">
        Safety Operations AI helps teams use SOPs, incident history, expert
        notes, site rules, and field images to get trusted safety guidance before
        risky work begins.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Link
          to={ROUTE_PATHS.auth.adminSignup}
          className="flex items-center gap-2 rounded-lg bg-safety-brand px-8 py-4 font-semibold text-white shadow-lg shadow-safety-brand/20 transition-all hover:-translate-y-px hover:bg-blue-700"
        >
          Sign Up
        </Link>
        <a
          href="#how-it-works"
          className="rounded-lg border border-safety-outline bg-white px-8 py-4 font-semibold text-safety-ink transition-all hover:bg-safety-surface"
        >
          See How It Works
        </a>
      </div>
      <div className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-8 border-t border-safety-outline pt-8">
        {HERO_TRUST_BADGES.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-1 text-sm font-medium text-safety-muted"
          >
            <MaterialIcon
              name={badge.icon}
              className="text-sm text-safety-brand"
            />
            {badge.label}
          </div>
        ))}
      </div>
    </div>
  </section>
);
