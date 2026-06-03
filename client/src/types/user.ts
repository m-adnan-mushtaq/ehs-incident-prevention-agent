export type UserRole = "admin" | "sme" | "field_worker";

export interface IRoleRef {
  id: string;
  name: UserRole | string;
  description?: string;
}

export interface ITenantRef {
  id: string;
  name: string;
  slug?: string;
  status?: string;
}

export interface ICurrentUser {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  role: UserRole | IRoleRef;
  role_id?: string;
  tenant_id?: string;
  tenant?: ITenantRef;
  last_login_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  role_id: string;
}

export interface IUpdateUserPayload {
  name?: string;
  role?: UserRole;
  is_active?: boolean;
  is_verified?: boolean;
}
