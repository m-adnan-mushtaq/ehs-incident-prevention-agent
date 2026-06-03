import { apiRoutes } from "@/constants";
import { unwrapData, type IApiEnvelope } from "@/lib/api";
import type { ICreateUserPayload, ICurrentUser, IUpdateUserPayload } from "@/types/user";
import { apiInstance } from "./_base";

export const createUser = async (payload: ICreateUserPayload) => {
  const response = await apiInstance.post<IApiEnvelope<ICurrentUser>>(
    apiRoutes.USERS.create(),
    payload
  );
  return unwrapData(response);
};

export const updateUser = async (id: string, payload: IUpdateUserPayload) => {
  const response = await apiInstance.patch<IApiEnvelope<ICurrentUser>>(
    apiRoutes.USERS.byId(id),
    payload
  );
  return unwrapData(response);
};

export const deleteUser = async (id: string) => {
  const response = await apiInstance.delete<IApiEnvelope<{ message: string }>>(
    apiRoutes.USERS.byId(id)
  );
  return unwrapData(response);
};

export const suspendUser = async (id: string) => {
  const response = await apiInstance.patch<IApiEnvelope<{ message: string }>>(
    apiRoutes.USERS.suspend(id)
  );
  return unwrapData(response);
};

export const activateUser = async (id: string) => {
  const response = await apiInstance.patch<IApiEnvelope<{ message: string }>>(
    apiRoutes.USERS.activate(id)
  );
  return unwrapData(response);
};
