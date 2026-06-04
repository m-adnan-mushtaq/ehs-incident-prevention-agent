import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type BrandPanelProps<T extends ElementType = "div"> = {
  children: ReactNode;
  className?: string;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

type BrandPanelBackdropProps = {
  soft?: boolean;
};

export const BrandPanelBackdrop = ({ soft = false }: BrandPanelBackdropProps) => (
  <div className="pointer-events-none absolute inset-0" aria-hidden>
    <div
      className={cn(
        "industrial-grid-dark absolute inset-0",
        soft ? "opacity-30" : "opacity-45"
      )}
    />
    <div
      className={cn(
        "diagonal-lines absolute inset-0",
        soft ? "opacity-20" : "opacity-30"
      )}
    />
    <div
      className={cn(
        "absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-safety-brand/25 blur-3xl",
        soft && "opacity-70"
      )}
    />
    <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />
  </div>
);

type BrandPanelTone = "dark" | "soft";

type BrandPanelExtendedProps<T extends ElementType = "div"> = BrandPanelProps<T> & {
  tone?: BrandPanelTone;
};

export const BrandPanel = <T extends ElementType = "div">({
  children,
  className,
  as,
  tone = "dark",
  ...props
}: BrandPanelExtendedProps<T>) => {
  const Tag = (as ?? "div") as ElementType;
  return (
  <Tag
    className={cn(
      "relative overflow-hidden text-white",
      tone === "soft" ? "brand-panel-soft" : "brand-panel-dark",
      className
    )}
    {...props}
  >
    <BrandPanelBackdrop soft={tone === "soft"} />
    <div className="relative z-10">{children}</div>
  </Tag>
  );
};
