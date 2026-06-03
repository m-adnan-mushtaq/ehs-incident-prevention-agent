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
  IDocument,
  IUpdateDocumentPayload,
  IUploadDocumentPayload,
} from "@/types/document";
import { apiInstance } from "./_base";

export const getPaginatedDocuments = async (
  params: PaginationParams
): Promise<PaginationResponse<IDocument>> => {
  const response = await apiInstance.get<
    IApiEnvelope<IPaginatedPayload<IDocument>>
  >(apiRoutes.DOCUMENTS.list(), { params: toApiPaginationParams(params) });
  return adaptPaginated(unwrapData(response));
};

export const uploadDocument = async (payload: IUploadDocumentPayload) => {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("title", payload.title);
  formData.append("source_scope", payload.source_scope);
  if (payload.description) formData.append("description", payload.description);
  if (payload.document_type)
    formData.append("document_type", payload.document_type);
  if (payload.topic) formData.append("topic", payload.topic);
  if (payload.version) formData.append("version", payload.version);
  if (payload.site_ids) formData.append("site_ids", payload.site_ids);

  const response = await apiInstance.post<IApiEnvelope<IDocument>>(
    apiRoutes.DOCUMENTS.list(),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return unwrapData(response);
};

export const updateDocument = async (
  id: string,
  payload: IUpdateDocumentPayload
) => {
  const response = await apiInstance.patch<IApiEnvelope<IDocument>>(
    apiRoutes.DOCUMENTS.byId(id),
    payload
  );
  return unwrapData(response);
};

export const deleteDocument = async (id: string) => {
  const response = await apiInstance.delete<IApiEnvelope<{ message: string }>>(
    apiRoutes.DOCUMENTS.byId(id)
  );
  return unwrapData(response);
};
