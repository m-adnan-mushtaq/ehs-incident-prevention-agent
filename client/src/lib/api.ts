import { PaginationParams, PaginationResponse } from "@/components/hoc/withPaginatedQuery";
import { AxiosResponse } from "axios";

export interface IApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface IPaginatedMeta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  total_pages: number;
  total_results: number;
  search?: string | null;
  sort_by?: string | null;
  sort_order?: string | null;
}

export interface IPaginatedPayload<T> {
  meta: IPaginatedMeta;
  data: T[];
}

export const unwrapData = <T>(response: AxiosResponse<IApiEnvelope<T>>): T =>
  response.data.data;

export const toApiPaginationParams = (
  params: PaginationParams
): Record<string, string | number> => ({
  page: params.page,
  limit: params.page_size,
  ...(params.search ? { search: params.search } : {}),
});

export const adaptPaginated = <T>(
  payload: IPaginatedPayload<T>
): PaginationResponse<T> => ({
  count: payload.meta.total,
  next: null,
  previous: null,
  results: payload.data,
});

export const getApiErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const data = (error as { response?: { data?: unknown } }).response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      if (typeof record.detail === "string") return record.detail;
      if (typeof record.message === "string") return record.message;
    }
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};
