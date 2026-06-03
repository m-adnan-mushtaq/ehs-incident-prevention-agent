import {
  PaginationParams,
  PaginationResponse,
} from "@/components/hoc/withPaginatedQuery";
import {
  adaptPaginated,
  IPaginatedPayload,
  toApiPaginationParams,
  unwrapData,
  type IApiEnvelope,
} from "@/lib/api";
import type {
  IAdminSignupPayload,
  ILoginPayload,
  ILoginResponse,
  ISignupResponse,
} from "@/types/auth";
import type { ICurrentUser } from "@/types/user";
import { apiRoutes } from "@/constants";
import { apiInstance } from "./_base";

export const login = async (data: ILoginPayload) => {
  const response = await apiInstance.post<IApiEnvelope<ILoginResponse>>(
    apiRoutes.AUTH.login(),
    data
  );
  return unwrapData(response);
};

export const signup = async (data: IAdminSignupPayload) => {
  const response = await apiInstance.post<IApiEnvelope<ISignupResponse>>(
    apiRoutes.AUTH.signup(),
    data
  );
  return unwrapData(response);
};

export const getCurrentUser = async (): Promise<ICurrentUser> => {
  const response = await apiInstance.get<IApiEnvelope<ICurrentUser>>(
    apiRoutes.USERS.me()
  );
  return unwrapData(response);
};

export const forgotPassword = (email: string) =>
  apiInstance.post<IApiEnvelope<{ message?: string }>>(
    apiRoutes.AUTH.forgotPassword(),
    { email }
  );

export const resetPassword = (payload: { token: string; password: string }) =>
  apiInstance.post<IApiEnvelope<{ message?: string }>>(
    apiRoutes.AUTH.resetPassword(),
    payload
  );

export const getPaginatedUsers = async (
  params: PaginationParams
): Promise<PaginationResponse<ICurrentUser>> => {
  const response = await apiInstance.get<
    IApiEnvelope<IPaginatedPayload<ICurrentUser>>
  >(apiRoutes.USERS.list(), { params: toApiPaginationParams(params) });
  return adaptPaginated(unwrapData(response));
};
