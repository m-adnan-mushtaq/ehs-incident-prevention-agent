import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ISourceCitation } from "@/types/chat";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  formatConfidence,
  laneLabel,
  sourceTypeLabel,
} from "../utils/chat-formatters";

type Props = { citations?: ISourceCitation[] };

const laneDot = (lane?: string) => {
  switch (lane) {
    case "official_guidance":
      return "bg-blue-500";
    case "similar_incidents":
      return "bg-amber-500";
    case "expert_knowledge":
      return "bg-emerald-500";
    default:
      return "bg-slate-400";
  }
};

const SourceChip = ({ c }: { c: ISourceCitation }) => {
  const displayTitle = c.title || c.section_title || "Safety source";
  const pageInfo = c.page_number != null ? `p.${c.page_number}` : null;

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-[11px]">
      <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${laneDot(c.lane)}`} />
      <span className="truncate font-medium text-slate-800" title={displayTitle}>
        {displayTitle}
      </span>
      {pageInfo && (
        <span className="shrink-0 text-slate-400">{pageInfo}</span>
      )}
      {c.relevance_score != null && (
        <Badge variant="secondary" className="ml-auto h-4 shrink-0 px-1 text-[9px]">
          {formatConfidence(c.relevance_score)}
        </Badge>
      )}
    </div>
  );
};

const ExpandedSource = ({ c }: { c: ISourceCitation }) => (
  <div className="rounded-md border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs">
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${laneDot(c.lane)}`} />
      <span className="font-medium text-slate-900">
        {c.title || c.section_title || "Safety source"}
      </span>
    </div>
    <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
      <Badge variant="outline" className="h-4 px-1 text-[9px]">
        {sourceTypeLabel(c.source_type)}
      </Badge>
      {c.lane && (
        <Badge variant="outline" className="h-4 px-1 text-[9px]">
          {laneLabel(c.lane)}
        </Badge>
      )}
      {c.page_number != null && <span>Page {c.page_number}</span>}
      {c.relevance_score != null && (
        <span>{formatConfidence(c.relevance_score)} match</span>
      )}
      {c.confidence_score != null && (
        <span>Confidence: {formatConfidence(c.confidence_score)}</span>
      )}
    </div>
  </div>
);

export const ChatSources = ({ citations = [] }: Props) => {
  const [open, setOpen] = useState(false);
  if (!citations.length) return null;

  const preview = citations.slice(0, 3);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700">
        <span>Sources ({citations.length})</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>

      {!open && (
        <div className="mt-1.5 grid gap-1.5 sm:grid-cols-3">
          {preview.map((c, idx) => (
            <SourceChip key={c.id ?? `${c.source_type}-${idx}`} c={c} />
          ))}
          {citations.length > 3 && (
            <span className="self-center text-[10px] text-slate-400">
              +{citations.length - 3} more
            </span>
          )}
        </div>
      )}

      <CollapsibleContent>
        <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
          {citations.map((c, idx) => (
            <ExpandedSource key={c.id ?? `expand-${idx}`} c={c} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
