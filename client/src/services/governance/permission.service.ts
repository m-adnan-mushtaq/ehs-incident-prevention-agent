import { apiRoutes } from "@/constants";
import { apiInstance } from "../_base";
import { IPermissionSchema } from "@/lib/validation/permission.valiadation";

export interface IPermission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}

export type IPermissionAction =
  | "add"
  | "view"
  | "change"
  | "remove"
  | "approve";

export const permissionActionOptions = [
  {
    label: "View",
    value: "view",
  },
  {
    label: "Add",
    value: "add",
  },
  {
    label: "Change",
    value: "change",
  },
  {
    label: "Remove",
    value: "remove",
  },
  {
    label: "Approve",
    value: "approve",
  },
];

export interface IPermissionGroup {
  contentType: number;
  label: string;
  permissions: IPermission[];
}

export const getAllRecords = () => {
  return apiInstance.get<IPermission[]>(apiRoutes.PERMISSION.getAll());
};

export const getRecordById = (id: number) => {
  return apiInstance.get<IPermission>(apiRoutes.PERMISSION.getById(id));
};

export const createRecord = (payload: IPermissionSchema) => {
  return apiInstance.post<IPermission>(
    apiRoutes.PERMISSION.createNew(),
    payload
  );
};

export const updateRecordById = ({
  id,
  payload,
}: {
  id: number;
  payload: IPermissionSchema;
}) => {
  return apiInstance.put<IPermission>(
    apiRoutes.PERMISSION.updateById(id),
    payload
  );
};

export const deleteRecordById = (id: number) => {
  return apiInstance.delete(apiRoutes.PERMISSION.deleteById(id));
};
