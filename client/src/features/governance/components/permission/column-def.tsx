import { IPermission } from "@/services/governance/permission.service";
import { ColumnDefProps } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  ActionColumn,
  ColumnText,
  HeaderWrapper,
} from "@/components/column-def/base";
import { toTitleCase } from "@/helpers/common";
import { Badge } from "@/components/ui/badge";

export const usePermissionColumns = ({
  dependencies = [],
  handleEdit = () => {},
  handleDelete = () => {},
}: ColumnDefProps<IPermission>) => {
  const columns = useMemo<ColumnDef<IPermission>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <HeaderWrapper>Name</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText className="flex items-center gap-2">
              <span className="font-semibold capitalize">
                {info.row.original.name}
              </span>
            </ColumnText>
          );
        },
      },
      {
        accessorKey: "codename",
        header: () => <HeaderWrapper>Code Name</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText>{toTitleCase(info.row.original.codename)}</ColumnText>
          );
        },
      },
      {
        accessorKey: "content_type",
        header: () => <HeaderWrapper>Content Type</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText>
              <Badge variant="outline" className="rounded-full">
                {info.row.original.content_type}
              </Badge>
            </ColumnText>
          );
        },
      },
      ActionColumn<IPermission>({
        actions: [
          {
            label: "Edit Permission",
            onClick: handleEdit,
          },
          {
            label: "Remove Permission",
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
