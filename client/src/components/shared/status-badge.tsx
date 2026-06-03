import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/helpers/common";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  uploaded: "bg-sky-500/15 text-sky-200 border-sky-500/30",
  processing: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  processed: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  failed: "bg-red-500/15 text-red-200 border-red-500/30",
  archived: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  suspended: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  inactive: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

type StatusBadgeProps = {
  status?: string | null;
  className?: string;
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const key = (status || "unknown").toLowerCase();
  const label =
    key === "inactive" || key === "false"
      ? "Inactive"
      : toTitleCase(key.replace(/_/g, " "));

  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-medium",
        statusStyles[key] ?? "bg-slate-500/10 text-slate-300 border-slate-600/40",
        className
      )}
    >
      {label}
    </Badge>
  );
};
