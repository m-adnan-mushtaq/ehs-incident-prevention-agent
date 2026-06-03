import {
  IAccountSchema,
  IAddUserSchema,
  IForgotPasswordSchema,
  ILoginSchema,
  IResetPasswordSchema,
  IUpdatePasswordSchema,
} from "@/lib/validation/auth.validation";
import { apiInstance } from "./_base";
import { apiRoutes } from "@/constants";
import {
  PaginationParams,
  PaginationResponse,
} from "@/components/hoc/withPaginatedQuery";

export interface IUser {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  admin?: boolean;
  city?: string;
  phone_number?: string;
  profile_photo?: string;
  country?: string;
  about_me?: string;
}

export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
  user: IUser;
}

export const login = (data: ILoginSchema) => {
  return apiInstance.post<IAuthResponse>(apiRoutes.AUTH.login(), data);
};

export const forgotPassword = (data: IForgotPasswordSchema) => {
  return apiInstance.post<{ detail: string }>(
    apiRoutes.AUTH.forgotPassword(),
    data
  );
};

export const getAccount = () => {
  return apiInstance.get<{
    status_code: number;
    profile: IUser;
  }>(apiRoutes.AUTH.getAccount());
};

export const logout = () => {
  return apiInstance.post(apiRoutes.AUTH.logout());
};

export type IResetPasswordPayload = {
  token: string;
  uid: string;
} & IResetPasswordSchema;
export const resetPassword = (payload: IResetPasswordPayload) => {
  return apiInstance.post<{ detail: string }>(
    apiRoutes.AUTH.resetPassword(payload.uid, payload.token),
    payload
  );
};

export const updateAccountInformation = (formData: FormData) => {
  return apiInstance.patch<{
    status_code: number;
    profile: IUser;
  }>(apiRoutes.AUTH.updateAccountInformation(), formData);
};

export const updatePersonalInformation = (payload: IAccountSchema) => {
  return apiInstance.put<IUser>(
    apiRoutes.AUTH.updatePersonalInformation(),
    payload
  );
};

export const updatePassword = (payload: IUpdatePasswordSchema) => {
  return apiInstance.post<{
    detail: string;
  }>(apiRoutes.AUTH.updatePassword(), payload);
};

export const getAllPaginatedUsers = async (
  params: PaginationParams
): Promise<PaginationResponse<IUser>> => {
  try {
    const result = await apiInstance.get<{
      status_code: number;
      profiles: PaginationResponse<IUser>;
    }>(apiRoutes.AUTH.getAllUsers(), {
      params,
    });
    return result?.data?.profiles;
  } catch (error) {
    throw error;
  }
};

export const addNewUser = async (payload: IAddUserSchema) => {
  return apiInstance.post<{ detail: string }>(
    apiRoutes.AUTH.addNewUser(),
    payload
  );
};

export const verifyEmail = (token: string) => {
  return apiInstance.post<{ detail: string }>(apiRoutes.AUTH.verifyEmail(), {
    key: token,
  });
};

export const resendVerificationEmail = (email: string) => {
  return apiInstance.post<{ detail: string }>(
    apiRoutes.AUTH.resendVerificationEmail(),
    {
      email,
    }
  );
};

export interface IUserOption {
  pkid: number;
  id: string;
  name: string;
  email: string;
}

export const getAllUsers = () => {
  return apiInstance.get<IUserOption[]>(apiRoutes.AUTH.getAllUsersWithPK());
};

export interface ISector {
  pkid: number;
  id: string;
  name: string;
}

export const getAllSectors = () => {
  return apiInstance.get<ISector[]>(apiRoutes.AUTH.getAllSectors());
};
