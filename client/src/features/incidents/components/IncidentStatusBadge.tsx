import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "../utils/incident.constants";

const styles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  submitted: "bg-blue-50 text-blue-800 border-blue-200",
  under_review: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-red-800 border-red-200",
  archived: "bg-slate-100 text-slate-500 border-slate-200",
};

type Props = { status?: string | null; className?: string };

export const IncidentStatusBadge = ({ status, className }: Props) => {
  const key = (status || "draft").toLowerCase();
  return (
    <Badge
      variant="outline"
      className={cn("border font-medium text-xs", styles[key] ?? styles.draft, className)}
    >
      {STATUS_LABELS[key] ?? key}
    </Badge>
  );
};
