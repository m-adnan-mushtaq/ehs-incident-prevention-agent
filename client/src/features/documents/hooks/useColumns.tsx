import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import type { TableActions } from "@/types";
import type { IDocument } from "@/types/document";
import { formatDateTime, toTitleCase } from "@/helpers/common";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Eye, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const documentTypeLabel = (value?: string | null) => {
  const key = (value || "").toLowerCase().replace(/[\s-]+/g, "_");
  const labels: Record<string, string> = {
    sop: "SOP",
    manual: "Manual",
    checklist: "Checklist",
    policy: "Policy",
    regulatory_guidance: "Regulatory Guidance",
  };
  return labels[key] ?? (value ? toTitleCase(value) : "Unclassified");
};

const scopeLabel = (value?: string | null) => {
  const key = (value || "").toLowerCase();
  if (key === "global") return "Global";
  if (key === "company") return "Company";
  if (key === "site") return "Site";
  return value ? toTitleCase(value) : "Global";
};

export const useColumns = (actions: TableActions<IDocument>) => {
  const columns = useMemo<ColumnDef<IDocument>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-slate-900">{row.original.title}</span>
          </div>
        ),
      },
      {
        accessorKey: "file_name",
        header: "File",
        cell: ({ row }) => row.original.file_name || "—",
      },
      {
        accessorKey: "document_type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            {documentTypeLabel(row.original.document_type)}
          </Badge>
        ),
      },
      {
        accessorKey: "source_scope",
        header: "Scope",
        cell: ({ row }) => (
          <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
            {scopeLabel(row.original.source_scope)}
          </Badge>
        ),
      },
      {
        id: "status",
        header: "Processing status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <StatusBadge status={row.original.status} />
            {row.original.status === "failed" && (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Uploaded",
        cell: ({ row }) =>
          row.original.created_at
            ? formatDateTime(row.original.created_at)
            : "—",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="text-slate-500 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => actions.handleView?.(row.original)}
              aria-label="View document"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-slate-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => actions.handleDelete?.(row.original)}
              aria-label="Archive document"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [actions]
  );

  return { columns };
};
