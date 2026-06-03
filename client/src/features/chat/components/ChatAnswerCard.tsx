import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { VoiceKnowledgeRiskBadge } from "@/features/voice-knowledge/components/VoiceKnowledgeRiskBadge";
import type { ISafetyAnswerCard } from "@/types/chat";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  formatConfidence,
  normalizeSafetyCard,
  toStringList,
} from "../utils/chat-formatters";
import { ChatMarkdownPreview } from "./ChatMarkdownPreview";
import { ChatSources } from "./ChatSources";

type Props = { card: ISafetyAnswerCard; answer?: string; mode?: string };

type SectionVariant = "default" | "warning" | "info";

const variantStyles: Record<SectionVariant, { container: string; title: string }> = {
  warning: {
    container: "rounded-md border border-amber-200 bg-amber-50/50 px-3 py-2",
    title: "text-amber-900",
  },
  info: {
    container: "rounded-md border border-blue-200 bg-blue-50/50 px-3 py-2",
    title: "text-blue-800",
  },
  default: {
    container: "",
    title: "text-slate-500",
  },
};

const CollapsibleList = ({
  title,
  items,
  variant = "default",
}: {
  title: string;
  items?: unknown;
  variant?: SectionVariant;
}) => {
  const [open, setOpen] = useState(false);
  const list = toStringList(items);
  if (!list.length) return null;
  const styles = variantStyles[variant];

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className={styles.container}>
        <CollapsibleTrigger className={`flex w-full items-center gap-1 text-xs font-semibold uppercase tracking-wide ${styles.title} hover:opacity-80`}>
          <span>{title} ({list.length})</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs text-slate-800">
            {list.map((item, idx) => (
              <li key={`${title}-${idx}`}>{item}</li>
            ))}
          </ul>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export const ChatAnswerCard = ({ card, answer, mode }: Props) => {
  const normalized = normalizeSafetyCard(card, answer);

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <VoiceKnowledgeRiskBadge risk={normalized.risk_level} />
        <span className="text-xs text-slate-500">
          Confidence {formatConfidence(normalized.confidence_score)}
        </span>
        {mode && (
          <Badge variant="secondary" className="text-[10px]">
            {mode.replace(/_/g, " ")}
          </Badge>
        )}
      </div>

      {normalized.task && (
        <div className="rounded-md border border-blue-200 bg-blue-50/60 px-3 py-1.5">
          <p className="text-[10px] font-semibold uppercase text-blue-800">Task</p>
          <p className="text-xs text-slate-900">{normalized.task}</p>
        </div>
      )}

      <ChatMarkdownPreview
        source={normalized.answer || answer}
        className="text-sm leading-relaxed text-slate-800"
      />

      {normalized.note && (
        <ChatMarkdownPreview
          source={normalized.note}
          className="text-[11px] italic text-slate-500"
        />
      )}

      <CollapsibleList title="Must verify" items={normalized.must_verify} variant="info" />
      <CollapsibleList title="Required PPE" items={normalized.required_ppe} />
      <CollapsibleList
        title="Stop work triggers"
        items={normalized.stop_work_triggers}
        variant="warning"
      />
      <CollapsibleList
        title="Common mistakes"
        items={normalized.common_mistakes}
        variant="warning"
      />
      <CollapsibleList
        title="Similar incidents"
        items={normalized.similar_incidents}
        variant="warning"
      />
      <CollapsibleList title="Steps" items={normalized.steps} />
      <CollapsibleList title="Warnings" items={normalized.warnings} variant="warning" />

      <ChatSources citations={normalized.citations} />
    </div>
  );
};
