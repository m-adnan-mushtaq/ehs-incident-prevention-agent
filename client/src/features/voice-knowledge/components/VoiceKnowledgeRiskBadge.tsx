import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const riskStyles: Record<string, string> = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

type Props = { risk?: string | null; className?: string };

export const VoiceKnowledgeRiskBadge = ({ risk, className }: Props) => {
  const key = (risk || "unknown").toLowerCase();
  const label = key === "unknown" ? "Risk N/A" : `${key.charAt(0).toUpperCase()}${key.slice(1)} risk`;

  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-medium uppercase tracking-wide text-xs",
        riskStyles[key] ?? "bg-slate-100 text-slate-600",
        className
      )}
    >
      {label}
    </Badge>
  );
};
