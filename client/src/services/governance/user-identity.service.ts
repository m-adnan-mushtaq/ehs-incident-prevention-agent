import { apiRoutes } from "@/constants";
import { apiInstance } from "../_base";
import { IUserIdentitySchema } from "@/lib/validation/user-identity.validation";

export enum UserIdentityStatus {
  ACTIVE = "active",
  TERMINATION = "termination",
  PENDING_REVIEW = "pending_review",
}
export interface IUserIdentity {
  id: string;
  user_email: string;
  user: number;
  department: number;
  status: UserIdentityStatus;
  created_at: string; // ISO 8601 date-time string
  updated_at: string; // ISO 8601 date-time string
  name: string;
}

export const userIdentityStatusOptions = [
  {
    label: "Active",
    value: UserIdentityStatus.ACTIVE,
  },
  {
    label: "Termination",
    value: UserIdentityStatus.TERMINATION,
  },
  {
    label: "Pending Review",
    value: UserIdentityStatus.PENDING_REVIEW,
  },
];

export const getAllRecords = () => {
  return apiInstance.get<IUserIdentity[]>(apiRoutes.USER_IDENTITY.getAll());
};

export const getRecordById = (id: string) => {
  return apiInstance.get<IUserIdentity>(apiRoutes.USER_IDENTITY.getById(id));
};

export const createRecord = (payload: IUserIdentitySchema) => {
  return apiInstance.post<IUserIdentity>(
    apiRoutes.USER_IDENTITY.createNew(),
    payload
  );
};

export const updateRecordById = ({
  id,
  payload,
}: {
  id: string;
  payload: IUserIdentitySchema;
}) => {
  return apiInstance.put<IUserIdentity>(
    apiRoutes.USER_IDENTITY.updateById(id),
    payload
  );
};

export const deleteRecordById = (id: string) => {
  return apiInstance.delete(apiRoutes.USER_IDENTITY.deleteById(id));
};
