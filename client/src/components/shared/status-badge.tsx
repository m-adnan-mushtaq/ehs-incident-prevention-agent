import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/helpers/common";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  uploaded: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  processed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
  suspended: "bg-amber-50 text-amber-700 border-amber-200",
  inactive: "bg-slate-100 text-slate-600 border-slate-200",
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
        statusStyles[key] ?? "bg-slate-100 text-slate-600 border-slate-200",
        className
      )}
    >
      {label}
    </Badge>
  );
};
