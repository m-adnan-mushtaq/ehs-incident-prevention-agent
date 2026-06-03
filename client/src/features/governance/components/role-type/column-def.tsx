import {
  ActionColumn,
  ColumnText,
  HeaderWrapper,
} from "@/components/column-def/base";
import { commonHelpers } from "@/helpers";
import { IRoleType } from "@/services/governance/role.service";
import { ColumnDefProps } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const useRoleTypeColumns = ({
  dependencies = [],
  handleEdit = () => {},
  handleDelete = () => {},
}: ColumnDefProps<IRoleType>) => {
  const columns = useMemo<ColumnDef<IRoleType>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <HeaderWrapper>Role Type</HeaderWrapper>,
        cell: (info) => {
          return <ColumnText>{info.row.original.name}</ColumnText>;
        },
      },
      {
        accessorKey: "created_by",
        header: () => <HeaderWrapper>Created By</HeaderWrapper>,
        cell: (info) => {
          return <ColumnText>{info.row.original.created_by}</ColumnText>;
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
      ActionColumn<IRoleType>({
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
