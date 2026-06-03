import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/helpers/common";

const statusStyles: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  pending_review: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  rejected: "bg-red-500/15 text-red-200 border-red-500/30",
  archived: "bg-slate-500/15 text-slate-400 border-slate-600/40",
  draft: "bg-slate-500/10 text-slate-400 border-slate-600/30",
  superseded: "bg-slate-500/10 text-slate-500 border-slate-600/30",
};

const statusLabels: Record<string, string> = {
  pending_review: "Review required",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
  draft: "Draft",
  superseded: "Superseded",
};

type Props = { status?: string | null; className?: string };

export const VoiceKnowledgeStatusBadge = ({ status, className }: Props) => {
  const key = (status || "draft").toLowerCase();
  const label = statusLabels[key] ?? toTitleCase(key.replace(/_/g, " "));

  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-medium",
        statusStyles[key] ?? "bg-slate-500/10 text-slate-300",
        className
      )}
    >
      {label}
    </Badge>
  );
};
