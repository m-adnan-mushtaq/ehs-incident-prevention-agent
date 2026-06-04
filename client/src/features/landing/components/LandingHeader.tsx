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
        "fixed top-0 z-50 flex h-16 w-full items-center justify-between px-6 backdrop-blur-md transition-colors duration-300",
        scrolled
          ? "border-b border-safety-outline bg-white/95 shadow-soft"
          : "border-b border-white/10 bg-safety-deep/50"
      )}
    >
      <BrandLogo
        to={ROUTE_PATHS.root}
        size="md"
        variant={scrolled ? "default" : "inverse"}
      />
      <nav className="hidden items-center gap-6 xl:flex">
        {LANDING_NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors",
              scrolled
                ? "text-safety-muted hover:text-safety-brand"
                : "text-slate-300 hover:text-white"
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link
          to={ROUTE_PATHS.auth.login}
          className={cn(
            "text-sm font-semibold transition-colors",
            scrolled
              ? "text-safety-ink hover:text-safety-brand"
              : "text-white hover:text-blue-200"
          )}
        >
          Sign In
        </Link>
        <Link
          to={ROUTE_PATHS.auth.adminSignup}
          className="rounded-lg bg-safety-brand px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-600"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};
