import { BrandPanelBackdrop } from "@/components/brand/BrandPanel";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type LandingSectionVariant =
  | "white"
  | "muted"
  | "tinted"
  | "spotlight"
  | "soft"
  | "dark";

const variantSurface: Record<LandingSectionVariant, string> = {
  white: "bg-white text-safety-ink",
  muted: "section-muted text-safety-ink",
  tinted: "section-tinted text-safety-ink",
  spotlight: "section-spotlight text-safety-ink",
  soft: "brand-panel-soft text-white",
  dark: "brand-panel-dark text-white",
};

type LandingSectionProps<T extends ElementType = "section"> = {
  children: ReactNode;
  variant?: LandingSectionVariant;
  className?: string;
  innerClassName?: string;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export const LandingSection = <T extends ElementType = "section">({
  children,
  variant = "white",
  className,
  innerClassName,
  as,
  ...props
}: LandingSectionProps<T>) => {
  const Tag = (as ?? "section") as ElementType;
  const isDark = variant === "dark" || variant === "soft";
  const hasLightGrid = variant === "muted" || variant === "tinted";

  return (
    <Tag
      className={cn(
        "relative overflow-hidden py-16 md:py-20",
        variantSurface[variant],
        className
      )}
      {...props}
    >
      {isDark && <BrandPanelBackdrop soft={variant === "soft"} />}
      {hasLightGrid && (
        <div
          className="industrial-grid pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        />
      )}
      {variant === "spotlight" && (
        <div className="section-spotlight-glow pointer-events-none absolute inset-0" aria-hidden />
      )}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-[1440px] px-6",
          innerClassName
        )}
      >
        {children}
      </div>
    </Tag>
  );
};
