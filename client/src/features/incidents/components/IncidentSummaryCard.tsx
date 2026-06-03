import type { IIncident } from "@/types/incident";
import type { ISite } from "@/types/site";
import { IncidentSeverityBadge } from "./IncidentSeverityBadge";
import { IncidentStatusBadge } from "./IncidentStatusBadge";
import { IncidentTypeBadge } from "./IncidentTypeBadge";
import {
  formatOccurredAt,
  formatReporter,
  formatSiteName,
} from "../utils/incident-formatters";
import { LEARNING_NOTE } from "../utils/incident.constants";

type Props = {
  incident: IIncident;
  sites: ISite[];
  currentUserId?: string;
};

export const IncidentSummaryCard = ({
  incident,
  sites,
  currentUserId,
}: Props) => (
  <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
    <div className="flex flex-wrap gap-2">
      <IncidentSeverityBadge severity={incident.severity} />
      <IncidentStatusBadge status={incident.status} />
      <IncidentTypeBadge type={incident.incident_type} />
    </div>
    <dl className="mt-4 grid gap-3 text-sm">
      <div>
        <dt className="text-slate-500">Site</dt>
        <dd className="text-slate-900">{formatSiteName(incident.site_id, sites)}</dd>
      </div>
      <div>
        <dt className="text-slate-500">Occurred</dt>
        <dd className="text-slate-900">{formatOccurredAt(incident.occurred_at)}</dd>
      </div>
      <div>
        <dt className="text-slate-500">Reported by</dt>
        <dd className="text-slate-900">
          {formatReporter(incident.reported_by, currentUserId)}
        </dd>
      </div>
      {incident.asset_name && (
        <div>
          <dt className="text-slate-500">Asset</dt>
          <dd className="text-slate-900">{incident.asset_name}</dd>
        </div>
      )}
      {incident.task_type && (
        <div>
          <dt className="text-slate-500">Task type</dt>
          <dd className="text-slate-900">{incident.task_type}</dd>
        </div>
      )}
    </dl>
    <p className="mt-4 text-xs leading-relaxed text-slate-600">{LEARNING_NOTE}</p>
  </aside>
);
