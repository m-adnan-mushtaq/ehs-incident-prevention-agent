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
  ICreateIncidentPayload,
  IIncident,
  IIncidentStatusPayload,
  IUpdateIncidentPayload,
} from "@/types/incident";
import { apiInstance } from "./_base";

const toIncidentListParams = (
  params: PaginationParams
): Record<string, string | number> => {
  const { page, page_size, search, site_id, status, severity, incident_type } =
    params;
  return {
    ...toApiPaginationParams({ page, page_size, search }),
    ...(site_id ? { site_id: String(site_id) } : {}),
    ...(status ? { status: String(status) } : {}),
    ...(severity ? { severity: String(severity) } : {}),
    ...(incident_type ? { incident_type: String(incident_type) } : {}),
  };
};

export const getIncidents = async (
  params: PaginationParams
): Promise<PaginationResponse<IIncident>> => {
  const response = await apiInstance.get<IApiEnvelope<IPaginatedPayload<IIncident>>>(
    apiRoutes.INCIDENTS.list(),
    { params: toIncidentListParams(params) }
  );
  return adaptPaginated(unwrapData(response));
};

export const getIncidentById = async (id: string): Promise<IIncident> => {
  const response = await apiInstance.get<IApiEnvelope<IIncident>>(
    apiRoutes.INCIDENTS.byId(id)
  );
  return unwrapData(response);
};

export const createIncident = async (payload: ICreateIncidentPayload) => {
  const response = await apiInstance.post<IApiEnvelope<IIncident>>(
    apiRoutes.INCIDENTS.list(),
    payload
  );
  return unwrapData(response);
};

export const updateIncident = async (
  id: string,
  payload: IUpdateIncidentPayload
) => {
  const response = await apiInstance.patch<IApiEnvelope<IIncident>>(
    apiRoutes.INCIDENTS.byId(id),
    payload
  );
  return unwrapData(response);
};

export const deleteIncident = async (id: string) => {
  const response = await apiInstance.delete<IApiEnvelope<{ message: string }>>(
    apiRoutes.INCIDENTS.byId(id)
  );
  return unwrapData(response);
};

export const updateIncidentStatus = async (
  id: string,
  payload: IIncidentStatusPayload
) => {
  const response = await apiInstance.patch<IApiEnvelope<IIncident>>(
    apiRoutes.INCIDENTS.status(id),
    payload
  );
  return unwrapData(response);
};

export const extractVoiceIncident = async (
  audioBlob: Blob
): Promise<import("@/features/incidents/utils/incident-extraction-helpers").IIncidentExtractionData> => {
  const { normalizeIncidentExtraction } = await import(
    "@/features/incidents/utils/incident-extraction-helpers"
  );
  const formData = new FormData();
  formData.append("file", audioBlob, `incident-voice-${Date.now()}.webm`);
  const response = await apiInstance.post<IApiEnvelope<unknown>>(
    apiRoutes.INCIDENTS.extractVoice(),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return normalizeIncidentExtraction(unwrapData(response));
};
