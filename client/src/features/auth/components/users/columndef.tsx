import {
  ActionColumn,
  ColumnText,
  HeaderWrapper,
} from "@/components/column-def/base";
import UserAvatar from "@/components/layout/user-avatar";
import { IUser } from "@/services/auth.service";
import { ColumnDefProps } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Link } from "react-router";

export const useUserColumns = ({
  dependencies = [],
  handleView = () => {},
}: ColumnDefProps<IUser>) => {
  const columns = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: "profile_photo",
        header: () => <HeaderWrapper>Profile</HeaderWrapper>,
        cell: (info) => {
          return <UserAvatar size="size-10" user={info.row.original} />;
        },
      },
      {
        accessorKey: "name",
        header: () => <HeaderWrapper>Name</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText>
              {`${info.row.original.first_name} ${info.row.original.last_name}`}
            </ColumnText>
          );
        },
      },
      {
        accessorKey: "email",
        header: () => <HeaderWrapper>Email</HeaderWrapper>,
        cell: (info) => {
          const email = info.row.original.email;
          return (
            <ColumnText>
              <Link to={`mailto:${email}`}>{email}</Link>
            </ColumnText>
          );
        },
      },
      {
        accessorKey: "phone_number",
        header: () => <HeaderWrapper>Phone</HeaderWrapper>,
        cell: (info) => {
          const phone = info.row.original.phone_number;
          if (!phone) return null;
          return (
            <ColumnText>
              <Link to={`tel:${phone}`}>{phone}</Link>
            </ColumnText>
          );
        },
      },
      {
        accessorKey: "gender",
        header: () => <HeaderWrapper>Gender</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText>
              {info.row.original.gender === "M" ? "Male" : "Female"}
            </ColumnText>
          );
        },
      },
      ActionColumn<IUser>({
        actions: [
          {
            label: "View Profile",
            onClick: handleView,
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
