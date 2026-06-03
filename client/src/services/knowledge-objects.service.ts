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
import type {
  ICreateKnowledgeObjectPayload,
  IKnowledgeObject,
  IUpdateKnowledgeObjectPayload,
} from "@/types/knowledge-object";
import { apiInstance } from "./_base";

export type KnowledgeListParams = PaginationParams & {
  source_type?: string;
  status?: string;
  topic?: string;
  risk_level?: string;
  site_id?: string;
};

const toListParams = (params: KnowledgeListParams) => {
  const { page, page_size, search, ...filters } = params;
  return {
    ...toApiPaginationParams({ page, page_size, search }),
    ...filters,
  };
};

export const getPaginatedKnowledgeObjects = async (
  params: KnowledgeListParams
): Promise<PaginationResponse<IKnowledgeObject>> => {
  const response = await apiInstance.get<
    IApiEnvelope<IPaginatedPayload<IKnowledgeObject>>
  >(apiRoutes.KNOWLEDGE.list(), { params: toListParams(params) });
  return adaptPaginated(unwrapData(response));
};

export const getKnowledgeObjectById = async (id: string) => {
  const response = await apiInstance.get<IApiEnvelope<IKnowledgeObject>>(
    apiRoutes.KNOWLEDGE.byId(id)
  );
  return unwrapData(response);
};

export const createKnowledgeObject = async (
  payload: ICreateKnowledgeObjectPayload
) => {
  const response = await apiInstance.post<IApiEnvelope<IKnowledgeObject>>(
    apiRoutes.KNOWLEDGE.list(),
    payload
  );
  return unwrapData(response);
};

export const updateKnowledgeObject = async (
  id: string,
  payload: IUpdateKnowledgeObjectPayload
) => {
  const response = await apiInstance.patch<IApiEnvelope<IKnowledgeObject>>(
    apiRoutes.KNOWLEDGE.byId(id),
    payload
  );
  return unwrapData(response);
};

export const deleteKnowledgeObject = async (id: string) => {
  const response = await apiInstance.delete<IApiEnvelope<{ message: string }>>(
    apiRoutes.KNOWLEDGE.byId(id)
  );
  return unwrapData(response);
};
