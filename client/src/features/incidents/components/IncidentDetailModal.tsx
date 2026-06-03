import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { IIncident } from "@/types/incident";
import type { ISite } from "@/types/site";
import { Loader2 } from "lucide-react";
import { IncidentSeverityBadge } from "./IncidentSeverityBadge";
import { IncidentStatusBadge } from "./IncidentStatusBadge";
import { IncidentTypeBadge } from "./IncidentTypeBadge";
import { IncidentSummaryCard } from "./IncidentSummaryCard";
import { formatOccurredAt } from "../utils/incident-formatters";
import { PREVENTION_NOTE } from "../utils/incident.constants";

type Props = {
  open: boolean;
  incident: IIncident | null;
  sites: ISite[];
  currentUserId?: string;
  isLoading?: boolean;
  onClose: () => void;
};

const TextBlock = ({ text }: { text?: string | null }) =>
  text ? (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
      {text}
    </p>
  ) : (
    <p className="text-sm text-slate-500">—</p>
  );

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

export const IncidentDetailModal = ({
  open,
  incident,
  sites,
  currentUserId,
  isLoading,
  onClose,
}: Props) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="max-h-[92vh] min-w-[min(1080px,calc(100vw-2rem))] overflow-y-auto border-slate-200 bg-white p-0 text-slate-950">
      {isLoading || !incident ? (
        <div className="flex items-center justify-center py-24 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2">Loading incident details...</span>
        </div>
      ) : (
        <>
          <DialogHeader className="border-b border-slate-200 px-6 py-5">
            <DialogTitle className="text-xl text-slate-950 pr-8">
              {incident.title}
            </DialogTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              <IncidentSeverityBadge severity={incident.severity} />
              <IncidentStatusBadge status={incident.status} />
              <IncidentTypeBadge type={incident.incident_type} />
              <span className="text-sm text-slate-500">
                Occurred {formatOccurredAt(incident.occurred_at)}
              </span>
            </div>
          </DialogHeader>

          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <Section title="What happened">
                <TextBlock text={incident.description} />
              </Section>
              <Separator />
              <Section title="Safety analysis">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Root cause</p>
                    <TextBlock text={incident.root_cause} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Corrective action</p>
                    <TextBlock text={incident.corrective_action} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Lessons learned</p>
                    <TextBlock text={incident.lessons_learned} />
                  </div>
                </div>
              </Section>
              <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {PREVENTION_NOTE}
              </p>
            </div>
            <IncidentSummaryCard
              incident={incident}
              sites={sites}
              currentUserId={currentUserId}
            />
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);
