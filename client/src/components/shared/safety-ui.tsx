import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
};

export const PageHeader = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) => (
  <div
    className={cn(
      "flex flex-col gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between",
      className
    )}
  >
    <div className="flex min-w-0 gap-3">
      {Icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      )}
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {eyebrow}
          </p>
        )}
        <h1 className="truncate text-2xl font-semibold text-slate-950">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </div>
);

type SectionCardProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const SectionCard = ({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: SectionCardProps) => (
  <section
    className={cn(
      "rounded-lg border border-slate-200 bg-white shadow-sm",
      className
    )}
  >
    {(title || description || actions) && (
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {title && (
            <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
          )}
          {description && (
            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
        {actions}
      </div>
    )}
    <div className={cn("p-4", contentClassName)}>{children}</div>
  </section>
);

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
  helper?: string;
  className?: string;
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-600",
};

export const StatCard = ({
  label,
  value,
  icon: Icon,
  tone = "blue",
  helper,
  className,
}: StatCardProps) => (
  <div
    className={cn(
      "rounded-lg border border-slate-200 bg-white p-4 shadow-sm",
      className
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      {Icon && (
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            toneStyles[tone]
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      )}
    </div>
    <div className="mt-3 text-2xl font-semibold text-slate-950">{value}</div>
    {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
  </div>
);

export const EmptyState = ({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-4 py-10 text-center">
    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-400 shadow-sm">
      <Icon className="h-5 w-5" aria-hidden />
    </div>
    <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
    {description && (
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    )}
  </div>
);

export const LoadingState = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-12 text-sm text-slate-500">
    <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-700" />
    {label}
  </div>
);

export const MetricSkeletonGrid = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} className="h-28 rounded-lg" />
    ))}
  </div>
);

export const RiskBadge = ({
  risk,
  className,
}: {
  risk?: string | null;
  className?: string;
}) => {
  const key = (risk || "unknown").toLowerCase();
  const styles: Record<string, string> = {
    low: "border-emerald-200 bg-emerald-50 text-emerald-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    high: "border-orange-200 bg-orange-50 text-orange-700",
    critical: "border-red-200 bg-red-50 text-red-700",
    unknown: "border-slate-200 bg-slate-100 text-slate-600",
    "n/a": "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-semibold capitalize",
        styles[key] ?? styles.unknown,
        className
      )}
    >
      {key === "unknown" ? "Risk N/A" : `${key.replace(/_/g, " ")} risk`}
    </Badge>
  );
};
