import {
  ActionColumn,
  ColumnText,
  HeaderWrapper,
} from "@/components/column-def/base";
import { Badge } from "@/components/ui/badge";
import { commonHelpers } from "@/helpers";
import { cn } from "@/lib/utils";
import {
  IUserIdentity,
  UserIdentityStatus,
} from "@/services/governance/user-identity.service";
import { ColumnDefProps } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const UserIdentityStatusChip = ({
  status,
}: {
  status: UserIdentityStatus;
}) => {
  const classesLookup: Record<UserIdentityStatus, string> = {
    pending_review:
      "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
    termination: "border-red-500 text-red-700 bg-red-50 hover:bg-red-100",
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

export const useUserIdentityColumns = ({
  dependencies = [],
  handleEdit = () => {},
  handleDelete = () => {},
}: ColumnDefProps<IUserIdentity>) => {
  const columns = useMemo<ColumnDef<IUserIdentity>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <HeaderWrapper>Name</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText className="flex items-center gap-2">
              <span className="inline-block size-2 bg-secondary rounded-full"></span>
              <span className="font-semibold">{info.row.original.name}</span>
            </ColumnText>
          );
        },
      },
      {
        accessorKey: "status",
        header: () => <HeaderWrapper>Status</HeaderWrapper>,
        cell: (info) => {
          return <UserIdentityStatusChip status={info.row.original.status} />;
        },
      },
      {
        accessorKey: "user_email",
        header: () => <HeaderWrapper>User</HeaderWrapper>,
        cell: (info) => {
          return <ColumnText>{info.row.original.user_email}</ColumnText>;
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
      ActionColumn<IUserIdentity>({
        actions: [
          {
            label: "Edit User Identity",
            onClick: handleEdit,
          },
          {
            label: "Remove User Identity",
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
