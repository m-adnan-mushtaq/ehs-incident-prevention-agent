import { StatusBadge } from "@/components/shared/status-badge";
import type { TableActions } from "@/types";
import type { ISite } from "@/types/site";
import { formatDateTime } from "@/helpers/common";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export const useColumns = (actions: TableActions<ISite>) => {
  const columns = useMemo<ColumnDef<ISite>[]>(
    () => [
      { accessorKey: "name", header: "Site name" },
      { accessorKey: "code", header: "Code", cell: ({ row }) => row.original.code || "—" },
      {
        accessorKey: "address",
        header: "Location",
        cell: ({ row }) => row.original.address || "—",
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "created_at",
        header: "Created",
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
              onClick={() => actions.handleEdit?.(row.original)}
            >
              <Pencil className="h-4 w-4" />
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
