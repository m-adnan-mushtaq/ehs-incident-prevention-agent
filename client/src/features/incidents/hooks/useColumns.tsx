import type { TableActions } from "@/types";
import type { IIncident } from "@/types/incident";
import type { ISite } from "@/types/site";
import { formatDateTime } from "@/helpers/common";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { IncidentSeverityBadge } from "../components/IncidentSeverityBadge";
import { IncidentStatusBadge } from "../components/IncidentStatusBadge";
import { IncidentTypeBadge } from "../components/IncidentTypeBadge";
import {
  formatReporter,
  formatSiteName,
} from "../utils/incident-formatters";

type ColumnOptions = TableActions<IIncident> & {
  sites: ISite[];
  currentUserId?: string;
  canEdit?: (incident: IIncident) => boolean;
  canArchive?: (incident: IIncident) => boolean;
};

export const useColumns = ({
  sites,
  currentUserId,
  canEdit,
  canArchive,
  handleView,
  handleEdit,
  handleDelete,
}: ColumnOptions) => {
  const columns = useMemo<ColumnDef<IIncident>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span className="font-medium text-slate-900">{row.original.title}</span>
          </div>
        ),
      },
      {
        id: "site",
        header: "Site",
        cell: ({ row }) => formatSiteName(row.original.site_id, sites),
      },
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => <IncidentTypeBadge type={row.original.incident_type} />,
      },
      {
        id: "severity",
        header: "Severity",
        cell: ({ row }) => (
          <IncidentSeverityBadge severity={row.original.severity} />
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <IncidentStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "asset_name",
        header: "Asset",
        cell: ({ row }) => row.original.asset_name || "—",
      },
      {
        accessorKey: "task_type",
        header: "Task",
        cell: ({ row }) => row.original.task_type || "—",
      },
      {
        accessorKey: "root_cause",
        header: "Root Cause",
        cell: ({ row }) => (
          <span className="line-clamp-2 block max-w-56 text-sm text-slate-600">
            {row.original.root_cause || "—"}
          </span>
        ),
      },
      {
        accessorKey: "corrective_action",
        header: "Corrective Action",
        cell: ({ row }) => (
          <span className="line-clamp-2 block max-w-56 text-sm text-slate-600">
            {row.original.corrective_action || "—"}
          </span>
        ),
      },
      {
        accessorKey: "occurred_at",
        header: "Occurred At",
        cell: ({ row }) =>
          row.original.occurred_at
            ? formatDateTime(row.original.occurred_at)
            : "—",
      },
      {
        id: "reported_by",
        header: "Reported By",
        cell: ({ row }) =>
          formatReporter(row.original.reported_by, currentUserId),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const incident = row.original;
          const showEdit = canEdit?.(incident);
          const showArchive = canArchive?.(incident);
          return (
            <div className="flex justify-end gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => handleView?.(incident)}
                aria-label="View incident"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {showEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => handleEdit?.(incident)}
                  aria-label="Edit incident"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {showArchive && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleDelete?.(incident)}
                  aria-label="Archive incident"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [sites, currentUserId, canEdit, canArchive, handleView, handleEdit, handleDelete]
  );

  return { columns };
};
