import { apiRoutes } from "@/constants";
import { apiInstance } from "../_base";
import { IRoleSchema } from "@/lib/validation/role.validation";

export interface IRoleType {
  pkid: number;
  id: string;
  name: string;
  created_by: string; //email of the user
  created_at: string;
  updated_at: string;
}

export enum IRoleStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const roleStatusOptions = [
  {
    label: "Active",
    value: IRoleStatus.ACTIVE,
  },
  {
    label: "Inactive",
    value: IRoleStatus.INACTIVE,
  },
];

export interface IRole {
  id: string;
  name: string;
  users: number[]; // Array of user IDs
  role_type: number;
  role_type_name: string;
  status: IRoleStatus;
  permissions: number[]; // Array of permission IDs
  created_at: string; // ISO 8601 date-time string
  updated_at: string; // ISO 8601 date-time string
}

export const getAllRoleTypes = () => {
  return apiInstance.get<IRoleType[]>(apiRoutes.ROLE_TYPE.getAll());
};

export const createNewRoleType = (payload: { name: string }) => {
  return apiInstance.post<IRoleType>(apiRoutes.ROLE_TYPE.createNew(), payload);
};

export const updateRoleTypeById = ({
  id,
  payload,
}: {
  id: string;
  payload: { name: string };
}) => {
  return apiInstance.put<IRoleType>(
    apiRoutes.ROLE_TYPE.updateById(id),
    payload
  );
};

export const deleteRoleTypeById = (id: string) => {
  return apiInstance.delete(apiRoutes.ROLE_TYPE.deleteById(id));
};

export const getAllRoles = () => {
  return apiInstance.get<IRole[]>(apiRoutes.ROLE.getAll());
};

export const getRoleById = (id: string) => {
  return apiInstance.get<IRole>(apiRoutes.ROLE.getById(id));
};

export const createNewRole = (payload: IRoleSchema) => {
  return apiInstance.post<IRole>(apiRoutes.ROLE.createNew(), payload);
};

export const updateRoleById = ({
  id,
  payload,
}: {
  id: string;
  payload: IRoleSchema;
}) => {
  return apiInstance.put<IRole>(apiRoutes.ROLE.updateById(id), payload);
};

export const deleteRoleById = (id: string) => {
  return apiInstance.delete(apiRoutes.ROLE.deleteById(id));
};
