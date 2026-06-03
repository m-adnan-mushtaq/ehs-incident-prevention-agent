import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import React from "react";
import { ChevronDown, ChevronUp, Inbox, Search } from "lucide-react";
import TableSkeleton from "./table-skeleton";
import DataTableViewOptions from "./columns-visibility";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ThemeInput } from "../form/ThemeInput";

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type SortingState = {
  id: string;
  desc: boolean;
}[];

export interface DataTableWrapperProps<TData> {
  data: TData[];
  total: number;
  sorting?: { id: string; desc: boolean }[];
  setSorting?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean }[]>
  >;
  bordered?: boolean;
  rounded?: boolean;
  striped?: boolean;
  size?: "sm" | "md" | "lg";
  visiblePagination?: boolean;
  pagination?: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  loading?: boolean;
  skipSorting?: boolean;
  emptyPlaceholder?: string;
}

interface DataTableProps<TData, TValue> extends DataTableWrapperProps<TData> {
  columns: ColumnDef<TData, TValue & { meta?: { hidden?: boolean } }>[];
}

function DataTable<TData, TValue>({
  columns,
  data = [] as any,
  total,
  sorting,
  setSorting,
  setPagination,
  pagination = { pageIndex: 0, pageSize: 10 },
  bordered = false,
  size = "md",
  visiblePagination,
  loading,
  skipSorting = false,
  emptyPlaceholder = "No records found",
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true, // Sorting is controlled externally
    manualPagination: true, // Pagination is controlled externally
    rowCount: total, // Total number of rows from server
    state: {
      ...(skipSorting ? {} : { sorting }),
      pagination,
      expanded,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => (row as any)?.subRows,
    getRowId: (row) => {
      if (typeof row === "object" && row !== null) {
        return (row as any).id;
      }
      return row;
    },
  });

  const pageCount = Math.ceil(total / pagination.pageSize);
  const maxVisiblePages = 5;

  const generatePageNumbers = () => {
    const { pageIndex } = pagination;
    const currentPage = pageIndex + 1;

    if (pageCount <= maxVisiblePages) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    let pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      pages.push(2, 3, 4);
      pages.push("...");
    } else if (currentPage >= pageCount - 2) {
      pages.push("...");
      pages.push(pageCount - 3, pageCount - 2, pageCount - 1);
    } else {
      pages.push("...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...");
    }

    // Always show last page
    pages.push(pageCount);

    return pages;
  };

  return (
    <div className="w-full relative max-w-screen-xl overflow-auto ">
      <div className="flex items-center justify-between">
        <div className="max-w-80 p-1">
          <ThemeInput
            startIcon={Search}
            className="rounded-sm border-secondary bg-white"
            placeholder="Search..."
          />
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <Table
        className={cn(
          "w-full mb-1",
          "rounded-lg",
          "border-separate border-spacing-y-4"
        )}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className={cn(!bordered && "!border-0", "position-relative")}
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                if ((header?.column?.columnDef as any)?.meta?.hidden)
                  return null;
                return (
                  <TableHead
                    key={header.id}
                    className={cn("cursor-pointer select-none bg-white")}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && !skipSorting && (
                        <>
                          <span className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => header.column.toggleSorting(false)}
                              className="p-0"
                            >
                              <ChevronUp
                                className={`h-3 w-3 ${
                                  header.column.getIsSorted() === "asc"
                                    ? "text-sky-400"
                                    : "text-slate-600"
                                }`}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => header.column.toggleSorting(true)}
                              className="p-0"
                            >
                              <ChevronDown
                                className={`h-3 w-3 ${
                                  header.column.getIsSorted() === "desc"
                                    ? "text-sky-400"
                                    : "text-slate-600"
                                }`}
                              />
                            </button>
                          </span>
                        </>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableSkeleton columns={columns.length} />
          ) : data.length ? (
            table.getRowModel().rows.map((_row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={cn(
                  size === "sm" && "h-8",
                  size === "md" && "h-12",
                  size === "lg" && "h-14",
                  !bordered && "!border-0"
                )}
              >
                {table
                  .getRowModel()
                  .rows[rowIndex]?.getVisibleCells()
                  .map((cell, cellIndex) => {
                    if ((cell.column.columnDef as any)?.meta?.hidden)
                      return null;
                    return (
                      <TableCell
                        style={{
                          ...(cell.column.columnDef.size
                            ? { width: `${cell.column.columnDef.size}px` }
                            : {}),
                        }}
                        className={cn(
                          "bg-white mb-2",

                          cellIndex === 0
                            ? "rounded-l-lg"
                            : cellIndex === columns.length - 1
                            ? "rounded-r-lg"
                            : ""
                        )}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <div className="flex items-center justify-center text-gray-400 flex-col my-4">
                  <Inbox size={40} className=" text-gray-300" />
                  <p className="font-semibold text-lg mt-2">
                    {loading ? "Loading..." : emptyPlaceholder}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {visiblePagination && typeof setPagination === "function" && (
        <div
          className={cn(
            "flex justify-between py-4",
            bordered && "border-borderBg border-none mt-1"
          )}
        >
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(value),
                }));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Pagination className="max-w-fit mx-0 text-darkSlate">
            <PaginationContent>
              <PaginationItem aria-disabled={pagination.pageIndex === 0}>
                <PaginationPrevious
                  className="cursor-pointer"
                  disabled={pagination.pageIndex === 0}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: Math.max(0, prev.pageIndex - 1),
                    }))
                  }
                />
              </PaginationItem>

              {generatePageNumbers().map((page, idx) =>
                typeof page === "number" ? (
                  <PaginationItem key={idx}>
                    <Button
                      className={`w-8 h-8 shadow-none rounded hover:text-white flex items-center justify-center ${
                        pagination.pageIndex === page - 1
                          ? "bg-primary text-white"
                          : "bg-white text-darkSlate"
                      }`}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: page - 1,
                        }))
                      }
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={idx}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  disabled={pagination.pageIndex >= pageCount - 1}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1),
                    }))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default React.memo(DataTable);
