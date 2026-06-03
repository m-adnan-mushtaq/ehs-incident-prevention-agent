import {
  ActionColumn,
  ColumnText,
  HeaderWrapper,
} from "@/components/column-def/base";
import { Badge } from "@/components/ui/badge";
import { commonHelpers } from "@/helpers";
import { cn } from "@/lib/utils";
import { IRole, IRoleStatus } from "@/services/governance/role.service";
import { ColumnDefProps } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const RoleStatusChip = ({ status }: { status: IRoleStatus }) => {
  const classesLookup: Record<IRoleStatus, string> = {
    inactive:
      "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
    active: "border-green-500 text-green-700 bg-green-50 hover:bg-green-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        classesLookup[status],
        "rounded-full px-4 py-1 min-w-max border-2 font-medium transition-colors"
      )}
    >
      {commonHelpers.toTitleCase(status.replace("_", " "))}
    </Badge>
  );
};

export const useRoleColumns = ({
  dependencies = [],
  handleEdit = () => {},
  handleDelete = () => {},
}: ColumnDefProps<IRole>) => {
  const columns = useMemo<ColumnDef<IRole>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <HeaderWrapper>Name</HeaderWrapper>,
        cell: (info) => {
          return <ColumnText>{info.row.original.name}</ColumnText>;
        },
      },
      {
        accessorKey: "role_type",
        header: () => <HeaderWrapper>Role Type</HeaderWrapper>,
        cell: (info) => {
          return <ColumnText>{info.row.original.role_type_name}</ColumnText>;
        },
      },
      {
        accessorKey: "status",
        header: () => <HeaderWrapper>Status</HeaderWrapper>,
        cell: (info) => {
          return <RoleStatusChip status={info.row.original.status} />;
        },
      },
      {
        accessorKey: "created_at",
        header: () => <HeaderWrapper>Created At</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText>
              {commonHelpers.formatDateTime(info.row.original.created_at)}
            </ColumnText>
          );
        },
      },
      {
        accessorKey: "updated_at",
        header: () => <HeaderWrapper>Last Updated</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText>
              {commonHelpers.formatDateTime(info.row.original.updated_at)}
            </ColumnText>
          );
        },
      },
      ActionColumn<IRole>({
        actions: [
          {
            label: "Edit Role",
            onClick: handleEdit,
          },
          {
            label: "Remove Role",
            onClick: handleDelete,
          },
        ],
      }),
    ],
    dependencies
  );

  return {
    columns,
  };
};
