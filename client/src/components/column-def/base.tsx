import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ComponentProps, PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { commonHelpers } from "@/helpers";

export const HeaderWrapper = ({ children }: PropsWithChildren) => (
  <h5 className="text-[#91929E] text-sm min-w-max w-full flex items-center gap-2 ">
    {children}
  </h5>
);

type SpanProps = ComponentProps<"span">;
export const ColumnText = ({
  children,
  className,
  ...props
}: PropsWithChildren & SpanProps) => (
  <span
    className={cn(
      "text-foreground truncate max-w-56 text-nowrap  inline-block  text-opacity-80 pe-4",
      className
    )}
    title={String(children)}
    {...props}
  >
    {children}
  </span>
);

export const ActionColumn = <T,>({
  actions,
}: {
  actions: {
    label: React.ReactNode;
    onClick: (row: T) => void;
  }[];
}): ColumnDef<T> => {
  return {
    id: "actions",
    enableSorting: false,
    header: () => <HeaderWrapper>Actions</HeaderWrapper>,
    accessorKey: "actions",
    enableHiding: false,
    cell: (info) => {
      const row = info.row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-primary-light cursor-pointer mx-auto px-0.5 py-0.5 rounded ">
            <EllipsisVertical size={16} className="text-slateText" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actions.map((action, index) => (
              <DropdownMenuItem key={index} onClick={() => action.onClick(row)}>
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
};

export function getDateTimeColumns<
  T extends { created_at: string | Date; updated_at: string | Date }
>(): ColumnDef<T>[] {
  return [
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
  ];
}
