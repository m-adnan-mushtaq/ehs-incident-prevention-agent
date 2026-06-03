import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SEVERITY_LABELS } from "../utils/incident.constants";

const styles: Record<string, string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-blue-50 text-blue-800 border-blue-200",
  high: "bg-amber-50 text-amber-800 border-amber-200",
  critical: "bg-red-50 text-red-800 border-red-200",
};

type Props = { severity?: string | null; className?: string };

export const IncidentSeverityBadge = ({ severity, className }: Props) => {
  const key = (severity || "").toLowerCase();
  if (!key) return null;
  return (
    <Badge
      variant="outline"
      className={cn("border font-medium text-xs", styles[key] ?? styles.low, className)}
    >
      {SEVERITY_LABELS[key] ?? key}
    </Badge>
  );
};
