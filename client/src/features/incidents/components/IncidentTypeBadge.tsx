import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatIncidentType } from "../utils/incident-formatters";

type Props = { type?: string | null; className?: string };

export const IncidentTypeBadge = ({ type, className }: Props) => {
  if (!type) return <span className="text-sm text-slate-500">—</span>;
  return (
    <Badge
      variant="outline"
      className={cn(
        "border border-slate-200 bg-slate-50 font-medium text-xs text-slate-700",
        className
      )}
    >
      {formatIncidentType(type)}
    </Badge>
  );
};
