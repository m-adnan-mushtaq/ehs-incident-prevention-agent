import { StatusBadge } from "@/components/shared/status-badge";
import type { TableActions } from "@/types";
import type { ICurrentUser } from "@/types/user";
import { roleLabel, getUserRole } from "@/lib/user-role";
import { formatDateTime } from "@/helpers/common";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export const useColumns = (actions: TableActions<ICurrentUser>) => {
  const columns = useMemo<ColumnDef<ICurrentUser>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      {
        id: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = getUserRole(row.original);
          return role ? roleLabel[role] : "—";
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.is_active ? "active" : "inactive"}
          />
        ),
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
