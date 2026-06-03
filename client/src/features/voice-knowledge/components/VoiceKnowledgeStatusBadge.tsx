import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/helpers/common";

const statusStyles: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending_review: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  superseded: "bg-slate-100 text-slate-500 border-slate-200",
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
        statusStyles[key] ?? "bg-slate-100 text-slate-600",
        className
      )}
    >
      {label}
    </Badge>
  );
};
