import type { ICurrentUser } from "./user";

export interface IAuthTokens {
  access: {
    token: string;
    expires: string;
  };
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAdminSignupPayload {
  email: string;
  password: string;
  name: string;
  tenant_name: string;
}

export interface ILoginResponse {
  user: ICurrentUser;
  tokens: IAuthTokens;
}

export interface ISignupResponse {
  user: ICurrentUser;
  tokens: IAuthTokens;
}
