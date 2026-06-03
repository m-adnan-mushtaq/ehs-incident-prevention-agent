import { IDocument } from "@/services/document.service";
import { ColumnDefProps } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { ColumnText, HeaderWrapper } from "./base";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/helpers/common";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../shared/column-sorting";

const ActionsColumn = ({
  handleDelete,
  handleEdit,
  handleView,
}: {
  handleDelete: () => void;
  handleEdit: () => void;
  handleView: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-primary-light cursor-pointer mx-auto px-0.5 py-0.5 rounded ">
        <EllipsisVertical size={16} className="text-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleView}>View Details</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>Edit Details</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          Move to Trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const useDocumentManagementColumns = ({
  handleDelete = () => {},
  handleEdit = () => {},
  handleView = () => {},
  dependencies = [],
  skipColumns = [],
}: ColumnDefProps<IDocument> & {
  handleRemoveColumn: (col: keyof IDocument) => void;
}) => {
  const columns = useMemo<ColumnDef<IDocument>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: (info) => {
          const row = info.row;
          // const isExpandedRow = row.getIsExpanded();
          const depth = row.depth;
          // console.log(row.depth, "row.depth");
          return (
            <div className={cn("flex items-center gap-2 relative")}>
              {depth > 0 && (
                <span
                  className="absolute left-0 top-0 h-full w-4"
                  style={{
                    transform: `translateX(-1rem)`,
                  }}
                >
                  <span
                    className="absolute left-1/2 top-0 h-full border-l border-gray-300"
                    style={{
                      borderColor: "#D1D5DB", // Tailwind gray-300
                    }}
                  ></span>
                </span>
              )}

              {row.getCanExpand() ? (
                <>
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      console.log("click");
                      row.getToggleExpandedHandler()();
                    }}
                    variant={"ghost"}
                    size={"icon"}
                  >
                    {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </>
              ) : null}
              <ColumnText>{info.row.original.title}</ColumnText>
            </div>
          );
        },
        meta: {
          hidden: skipColumns.includes("title"),
        },
      },

      {
        accessorKey: "version",
        header: () => <HeaderWrapper>Version</HeaderWrapper>,
        cell: (info) => {
          return <ColumnText>{info.row.original.version}</ColumnText>;
        },
        meta: {
          hidden: skipColumns.includes("version"),
        },
      },
      {
        accessorKey: "category",
        header: () => <HeaderWrapper>Category</HeaderWrapper>,
        cell: (info) => {
          return <ColumnText>{info.row.original.category}</ColumnText>;
        },
        meta: {
          hidden: skipColumns.includes("category"),
        },
      },
      {
        accessorKey: "department",
        header: () => <HeaderWrapper>Department</HeaderWrapper>,
        cell: (info) => {
          return <ColumnText>{info.row.original.department}</ColumnText>;
        },
        meta: {
          hidden: skipColumns.includes("department"),
        },
      },
      {
        accessorKey: "status",
        header: () => <HeaderWrapper>Status</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText className="text-muted-foreground px-2 py-1 rounded-sm border border-muted-foreground">
              {info.row.original.status}
            </ColumnText>
          );
        },
        meta: {
          hidden: skipColumns.includes("status"),
        },
      },
      {
        accessorKey: "updated_at",
        header: () => <HeaderWrapper>Updated At</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText>{formatDate(info.row.original.updated_at)}</ColumnText>
          );
        },
        meta: {
          hidden: skipColumns.includes("updated_at"),
        },
      },
      {
        accessorKey: "Actions",
        id: "actions",
        enableSorting: false,
        header: () => <HeaderWrapper></HeaderWrapper>,
        cell: (info) => {
          return (
            <ActionsColumn
              handleDelete={() => handleDelete(info.row.original)}
              handleEdit={() => handleEdit(info.row.original)}
              handleView={() => handleView(info.row.original)}
            />
          );
        },
      },
    ],
    dependencies
  );

  return {
    columns,
  };
};
