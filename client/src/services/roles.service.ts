import { apiRoutes } from "@/constants";
import { unwrapData, type IApiEnvelope } from "@/lib/api";
import type { IRole } from "@/types/role";
import { apiInstance } from "./_base";

export const getRoles = async (): Promise<IRole[]> => {
  const response = await apiInstance.get<IApiEnvelope<IRole[]>>(
    apiRoutes.ROLES.list()
  );
  return unwrapData(response);
};
