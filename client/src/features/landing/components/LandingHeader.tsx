import { BrandLogo } from "@/components/brand/BrandLogo";
import { ROUTE_PATHS } from "@/routes/paths";
import { LANDING_NAV } from "@/features/landing/constants";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-safety-outline bg-white/80 px-6 backdrop-blur-md",
        scrolled && "shadow-soft border-b-safety-brand/10"
      )}
    >
      <BrandLogo to={ROUTE_PATHS.root} size="md" />
      <nav className="hidden items-center gap-6 xl:flex">
        {LANDING_NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-safety-muted transition-colors hover:text-safety-brand"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link
          to={ROUTE_PATHS.auth.login}
          className="text-sm font-semibold text-safety-ink transition-colors hover:text-safety-brand"
        >
          Sign In
        </Link>
        <Link
          to={ROUTE_PATHS.auth.adminSignup}
          className="rounded-lg bg-safety-brand px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};
