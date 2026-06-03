import { StatusBadge } from "@/components/shared/status-badge";
import type { TableActions } from "@/types";
import type { IDocument } from "@/types/document";
import { formatDateTime, toTitleCase } from "@/helpers/common";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Eye, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

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
        cell: ({ row }) => row.original.document_type || "—",
      },
      {
        accessorKey: "source_scope",
        header: "Scope",
        cell: ({ row }) => toTitleCase(row.original.source_scope),
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
              className="text-slate-500 hover:text-blue-700"
              onClick={() => actions.handleView?.(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-slate-500 hover:text-red-600"
              onClick={() => actions.handleDelete?.(row.original)}
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
