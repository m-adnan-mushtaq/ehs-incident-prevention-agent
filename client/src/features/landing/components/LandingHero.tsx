import { BrandPanel } from "@/components/brand/BrandPanel";
import { MaterialIcon } from "@/components/brand/MaterialIcon";
import { ROUTE_PATHS } from "@/routes/paths";
import { HERO_TRUST_BADGES } from "@/features/landing/constants";
import { Link } from "@tanstack/react-router";

export const LandingHero = () => (
  <BrandPanel as="section" className="pb-20 pt-28">
    <div className="mx-auto max-w-[1440px] space-y-8 px-6 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
        <span className="flex h-2 w-2 rounded-full bg-blue-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
          Enterprise-Grade Safety Intelligence
        </span>
      </div>
      <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-[56px] lg:leading-[64px]">
        Turn scattered safety knowledge into real-time incident prevention
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-slate-300">
        Unify SOPs, incident history, expert notes, and site rules into trusted
        guidance before risky work begins.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <Link
          to={ROUTE_PATHS.auth.adminSignup}
          className="flex items-center gap-2 rounded-lg bg-safety-brand px-8 py-4 font-semibold text-white shadow-lg shadow-blue-900/40 transition-all hover:-translate-y-px hover:bg-blue-600"
        >
          Sign Up
        </Link>
        <a
          href="#how-it-works"
          className="rounded-lg border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
        >
          See How It Works
        </a>
      </div>
      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8">
        {HERO_TRUST_BADGES.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
          >
            <MaterialIcon
              name={badge.icon}
              className="text-sm text-blue-300"
            />
            {badge.label}
          </div>
        ))}
      </div>
    </div>
  </BrandPanel>
);
