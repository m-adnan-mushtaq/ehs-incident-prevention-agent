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
import {
  isPreviewableCitation,
  type ChatSourcePreviewTarget,
} from "../hooks/useChatSourcePreview";
import { ChatSourcePreviewModals } from "./ChatSourcePreviewModals";

type Props = { citations?: ISourceCitation[] };

const dedupeBySourceId = (citations: ISourceCitation[]): ISourceCitation[] => {
  const seen = new Set<string>();
  return citations.filter((c) => {
    const sourceId = c.source_id;
    if (!sourceId) return true;
    if (seen.has(sourceId)) return false;
    seen.add(sourceId);
    return true;
  });
};

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

const previewableClass = (previewable: boolean) =>
  previewable
    ? "cursor-pointer transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    : "";

const SourceChip = ({
  c,
  onSourceClick,
}: {
  c: ISourceCitation;
  onSourceClick: (c: ISourceCitation) => void;
}) => {
  const displayTitle = c.title || c.section_title || "Safety source";
  const pageInfo = c.page_number != null ? `p.${c.page_number}` : null;
  const previewable = isPreviewableCitation(c);

  return (
    <button
      type="button"
      disabled={!previewable}
      onClick={() => onSourceClick(c)}
      className={`flex w-full items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-left text-[11px] disabled:cursor-default ${previewableClass(previewable)}`}
    >
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
    </button>
  );
};

const ExpandedSource = ({
  c,
  onSourceClick,
}: {
  c: ISourceCitation;
  onSourceClick: (c: ISourceCitation) => void;
}) => {
  const previewable = isPreviewableCitation(c);

  return (
    <button
      type="button"
      disabled={!previewable}
      onClick={() => onSourceClick(c)}
      className={`w-full rounded-md border border-slate-200 bg-slate-50/80 px-3 py-2 text-left text-xs disabled:cursor-default ${previewableClass(previewable)}`}
    >
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
    </button>
  );
};

export const ChatSources = ({ citations = [] }: Props) => {
  const [open, setOpen] = useState(false);
  const [previewTarget, setPreviewTarget] =
    useState<ChatSourcePreviewTarget>(null);

  const uniqueCitations = dedupeBySourceId(citations);
  if (!uniqueCitations.length) return null;

  const preview = uniqueCitations.slice(0, 3);

  const handleSourceClick = (c: ISourceCitation) => {
    if (!c.source_id || !isPreviewableCitation(c)) return;
    setPreviewTarget({
      sourceId: c.source_id,
      sourceType: c.source_type,
    });
  };

  return (
    <>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex w-full items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700">
          <span>Sources ({uniqueCitations.length})</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>

        {!open && (
          <div className="mt-1.5 grid gap-1.5 sm:grid-cols-3">
            {preview.map((c, idx) => (
              <SourceChip
                key={c.id ?? `${c.source_type}-${idx}`}
                c={c}
                onSourceClick={handleSourceClick}
              />
            ))}
            {uniqueCitations.length > 3 && (
              <span className="self-center text-[10px] text-slate-400">
                +{uniqueCitations.length - 3} more
              </span>
            )}
          </div>
        )}

        <CollapsibleContent>
          <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
            {uniqueCitations.map((c, idx) => (
              <ExpandedSource
                key={c.id ?? `expand-${idx}`}
                c={c}
                onSourceClick={handleSourceClick}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <ChatSourcePreviewModals
        target={previewTarget}
        onClose={() => setPreviewTarget(null)}
      />
    </>
  );
};
