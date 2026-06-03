export type SiteStatus = "active" | "suspended" | "archived";

export interface ISite {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  address?: string | null;
  status: SiteStatus | string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ICreateSitePayload {
  name: string;
  code?: string;
  description?: string;
  address?: string;
  status?: SiteStatus;
}

export interface IUpdateSitePayload {
  name?: string;
  code?: string;
  description?: string;
  address?: string;
  status?: SiteStatus;
}
