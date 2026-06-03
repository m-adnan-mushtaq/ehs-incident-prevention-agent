import {
  PaginationParams,
  PaginationResponse,
} from "@/components/hoc/withPaginatedQuery";
import { apiRoutes } from "@/constants";
import {
  adaptPaginated,
  IPaginatedPayload,
  toApiPaginationParams,
  unwrapData,
  type IApiEnvelope,
} from "@/lib/api";
import type { ICreateSitePayload, ISite, IUpdateSitePayload } from "@/types/site";
import { apiInstance } from "./_base";

export const getPaginatedSites = async (
  params: PaginationParams
): Promise<PaginationResponse<ISite>> => {
  const response = await apiInstance.get<IApiEnvelope<IPaginatedPayload<ISite>>>(
    apiRoutes.SITES.list(),
    { params: toApiPaginationParams(params) }
  );
  return adaptPaginated(unwrapData(response));
};

export const getAllSites = async (): Promise<ISite[]> => {
  const response = await apiInstance.get<IApiEnvelope<ISite[]>>(
    apiRoutes.SITES.all()
  );
  return unwrapData(response);
};

export const createSite = async (payload: ICreateSitePayload) => {
  const response = await apiInstance.post<IApiEnvelope<ISite>>(
    apiRoutes.SITES.list(),
    payload
  );
  return unwrapData(response);
};

export const updateSite = async (id: string, payload: IUpdateSitePayload) => {
  const response = await apiInstance.patch<IApiEnvelope<ISite>>(
    apiRoutes.SITES.byId(id),
    payload
  );
  return unwrapData(response);
};

export const deleteSite = async (id: string) => {
  const response = await apiInstance.delete<IApiEnvelope<{ message: string }>>(
    apiRoutes.SITES.byId(id)
  );
  return unwrapData(response);
};
