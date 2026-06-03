import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, toTitleCase } from "@/helpers/common";
import type { IKnowledgeObject } from "@/types/knowledge-object";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { VoiceKnowledgeRiskBadge } from "./VoiceKnowledgeRiskBadge";
import { VoiceKnowledgeStatusBadge } from "./VoiceKnowledgeStatusBadge";
import { VOICE_SOURCE_TYPE } from "../utils/voiceKnowledge.constants";

type Props = {
  open: boolean;
  onClose: () => void;
  note: IKnowledgeObject | null;
  isLoading?: boolean;
  canApprove?: boolean;
  isApproving?: boolean;
  onApprove?: (note: IKnowledgeObject) => void | Promise<void>;
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
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
      {text}
    </p>
  ) : (
    <p className="text-sm text-slate-600">—</p>
  );

const ListBlock = ({
  items,
  icon,
}: {
  items?: string[] | null;
  icon?: React.ReactNode;
}) => {
  if (!items?.length) return <p className="text-sm text-slate-600">—</p>;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-sm text-slate-700"
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
  canApprove,
  isApproving,
  onApprove,
}: Props) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="max-h-[92vh] min-w-[min(1080px,calc(100vw-2rem))] overflow-y-auto border-slate-200 bg-white p-0 text-slate-950">
      {isLoading || !note ? (
        <div className="flex items-center justify-center py-24 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2">Loading note details...</span>
        </div>
      ) : (
        <>
          <DialogHeader className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-4 pr-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <DialogTitle className="text-xl text-slate-950">
                  {note.title}
                </DialogTitle>
                <div className="mt-3 flex flex-wrap gap-2">
                  <VoiceKnowledgeStatusBadge status={note.status} />
                  {note.risk_level && (
                    <VoiceKnowledgeRiskBadge risk={note.risk_level} />
                  )}
                  {note.confidence_score != null && (
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                      {Math.round(Number(note.confidence_score) * 100)}%
                      confidence
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                  {note.topic && <span>Topic: {note.topic}</span>}
                  {note.asset_name && <span>Asset: {note.asset_name}</span>}
                  {note.task_type && <span>Task: {note.task_type}</span>}
                </div>
              </div>
              {canApprove && note.status !== "approved" && (
                <Button
                  className="shrink-0"
                  disabled={isApproving}
                  onClick={() => onApprove?.(note)}
                >
                  {isApproving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Approve note
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
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
                    <p className="text-xs text-slate-500 mb-1">
                      Recommended action
                    </p>
                    <TextBlock text={note.recommended_action} />
                  </div>
                </div>
              </Section>

              <Separator />

              <Section title="Lesson and warning">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Lesson learned
                    </p>
                    <TextBlock text={note.lesson_learned} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Safety warning
                    </p>
                    <TextBlock text={note.safety_warning} />
                  </div>
                </div>
              </Section>

              <Separator />

              <Section title="Required PPE">
                <ListBlock items={note.required_ppe as string[] | null} />
              </Section>

              <Section title="Stop work triggers">
                <ListBlock
                  items={note.stop_work_triggers as string[] | null}
                  icon={
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  }
                />
              </Section>

              <Separator />

              <Section title="Voice transcript / SME notes">
                <TextBlock text={note.sme_notes} />
              </Section>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Section title="Metadata">
                <dl className="grid gap-4 text-sm">
                  <div>
                    <dt className="text-slate-500">Source</dt>
                    <dd className="text-slate-900">
                      {toTitleCase(note.source_type || VOICE_SOURCE_TYPE)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Created</dt>
                    <dd className="text-slate-900">
                      {note.created_at ? formatDateTime(note.created_at) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Approved at</dt>
                    <dd className="text-slate-900">
                      {note.approved_at
                        ? formatDateTime(note.approved_at)
                        : "—"}
                    </dd>
                  </div>
                </dl>
              </Section>
            </aside>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);
