import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, toTitleCase } from "@/helpers/common";
import type { IKnowledgeObject } from "@/types/knowledge-object";
import { AlertTriangle, Loader2 } from "lucide-react";
import { VoiceKnowledgeRiskBadge } from "./VoiceKnowledgeRiskBadge";
import { VoiceKnowledgeStatusBadge } from "./VoiceKnowledgeStatusBadge";
import { VOICE_SOURCE_TYPE } from "../utils/voiceKnowledge.constants";

type Props = {
  open: boolean;
  onClose: () => void;
  note: IKnowledgeObject | null;
  isLoading?: boolean;
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
      {title}
    </h3>
    {children}
  </div>
);

const TextBlock = ({ text }: { text?: string | null }) =>
  text ? (
    <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{text}</p>
  ) : (
    <p className="text-sm text-slate-600">—</p>
  );

const ListBlock = ({ items, icon }: { items?: string[] | null; icon?: React.ReactNode }) => {
  if (!items?.length) return <p className="text-sm text-slate-600">—</p>;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-sm text-slate-300"
        >
          {icon}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export const VoiceKnowledgeDetailModal = ({
  open,
  onClose,
  note,
  isLoading,
}: Props) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-slate-800 bg-[#0c1424] text-slate-100">
      {isLoading || !note ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading note details...</span>
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-100 pr-8">
              {note.title}
            </DialogTitle>
            <div className="flex flex-wrap gap-2 pt-2">
              <VoiceKnowledgeStatusBadge status={note.status} />
              {note.risk_level && <VoiceKnowledgeRiskBadge risk={note.risk_level} />}
              {note.confidence_score != null && (
                <span className="text-xs text-slate-500">
                  {Math.round(Number(note.confidence_score) * 100)}% confidence
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400 pt-1">
              {note.topic && <span>Topic: {note.topic}</span>}
              {note.asset_name && <span>Asset: {note.asset_name}</span>}
              {note.task_type && <span>Task: {note.task_type}</span>}
            </div>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <Section title="Safety summary">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Problem</p>
                  <TextBlock text={note.problem} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Root cause</p>
                  <TextBlock text={note.root_cause} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Recommended action</p>
                  <TextBlock text={note.recommended_action} />
                </div>
              </div>
            </Section>

            <Separator className="bg-slate-800" />

            <Section title="Lesson and warning">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Lesson learned</p>
                  <TextBlock text={note.lesson_learned} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Safety warning</p>
                  <TextBlock text={note.safety_warning} />
                </div>
              </div>
            </Section>

            <Separator className="bg-slate-800" />

            <Section title="Required PPE">
              <ListBlock items={note.required_ppe as string[] | null} />
            </Section>

            <Section title="Stop work triggers">
              <ListBlock
                items={note.stop_work_triggers as string[] | null}
                icon={<AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />}
              />
            </Section>

            <Separator className="bg-slate-800" />

            <Section title="Voice transcript / SME notes">
              <TextBlock text={note.sme_notes} />
            </Section>

            <Separator className="bg-slate-800" />

            <Section title="Metadata">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-500">Source</dt>
                  <dd className="text-slate-300">
                    {toTitleCase(note.source_type || VOICE_SOURCE_TYPE)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Created</dt>
                  <dd className="text-slate-300">
                    {note.created_at ? formatDateTime(note.created_at) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Approved at</dt>
                  <dd className="text-slate-300">
                    {note.approved_at ? formatDateTime(note.approved_at) : "—"}
                  </dd>
                </div>
              </dl>
            </Section>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);
