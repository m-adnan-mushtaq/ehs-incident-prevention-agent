import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const riskStyles: Record<string, string> = {
  low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  medium: "bg-sky-500/15 text-sky-200 border-sky-500/30",
  high: "bg-amber-500/15 text-amber-200 border-amber-500/40",
  critical: "bg-red-500/20 text-red-200 border-red-500/40",
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
        riskStyles[key] ?? "bg-slate-500/10 text-slate-400",
        className
      )}
    >
      {label}
    </Badge>
  );
};
