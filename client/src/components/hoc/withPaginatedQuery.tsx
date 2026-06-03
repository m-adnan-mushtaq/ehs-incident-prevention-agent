import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const PAGINATION_OPTIONS = [10, 25, 50, 100];

export interface PaginationResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginationParams {
  page: number;
  page_size: number;
  search?: string;
  //   sortBy?: string;
  //   sortOrder?: string;
  [key: string]: any;
}

interface PaginatedQueryOptions<T> {
  queryKey: (string | number | object)[];
  queryFn: (params: PaginationParams) => Promise<PaginationResponse<T>>;
  defaultAdditionalFilters?: Record<string, any>;
}

export interface PaginationWrapperProps<T> {
  isLoading: boolean;
  data: T[];
  paginationModel: PaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<PaginationModel>>;
  sortModel: SortModel[];
  setSortModel: React.Dispatch<React.SetStateAction<SortModel[]>>;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  search: string;
  additionalFilters: Record<string, any>;
  setAdditionalFilters: React.Dispatch<
    React.SetStateAction<Record<string, any>>
  >;
  totalRecords: number;
}

interface PaginationModel {
  pageIndex: number;
  pageSize: number;
}

interface SortModel {
  id: string;
  desc: boolean;
}
[];

function withPaginatedQuery<TData>(
  WrappedComponent: React.ComponentType<any>,
  options: PaginatedQueryOptions<TData>
) {
  const WithPaginatedQuery: React.FC<any> = (props) => {
    // Pagination State
    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
      pageIndex: 0,
      pageSize: PAGINATION_OPTIONS[0],
    });

    // Search State
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search, 1000);

    // Additional Filters State
    const defaultAdditionalFilters = options.defaultAdditionalFilters || {};
    const [additionalFilters, setAdditionalFilters] = useState<
      Record<string, any>
    >(defaultAdditionalFilters);

    // Sorting State
    const [sortModel, setSortModel] = useState<SortModel[]>([
      {
        id: "id",
        desc: true,
      },
    ]);

    // Fetch data from the server
    const { data, error, isFetching } = useQuery({
      queryKey: [
        ...options.queryKey,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        debouncedSearch,
        sortModel?.[0]?.id,
        sortModel?.[0]?.desc === true ? "desc" : "asc",
        JSON.stringify(additionalFilters),
      ],
      queryFn: () =>
        options.queryFn({
          page: paginationModel.pageIndex + 1,
          page_size: paginationModel.pageSize,
          //   search: debouncedSearch,
          //   sortBy: sortModel[0]?.id,
          //   sortOrder: sortModel?.[0]?.desc === true ? "desc" : "asc",
          ...additionalFilters,
        }),
    });

    const handleSearch = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
      },
      []
    );

    useEffect(() => {
      setPaginationModel((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }, [debouncedSearch, JSON.stringify(additionalFilters)]);

    if (error) {
      return (
        <div className="p-4 max-w-screen-lg">
          <Alert variant="destructive" className="my-8 mx-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something, went wrong while processing your request, please try
              again
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <WrappedComponent
        {...props}
        isLoading={isFetching}
        data={data?.results || []}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        handleSearch={handleSearch}
        search={search}
        additionalFilters={additionalFilters}
        setAdditionalFilters={setAdditionalFilters}
        totalRecords={data?.count || 0}
      />
    );
  };

  WithPaginatedQuery.displayName = `WithPaginatedQuery(${getDisplayName(
    WrappedComponent
  )})`;

  return WithPaginatedQuery;
}

const getDisplayName = (WrappedComponent: React.ComponentType<any>) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export default withPaginatedQuery;
