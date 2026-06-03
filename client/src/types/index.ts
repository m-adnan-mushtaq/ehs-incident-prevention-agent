import type { LucideIcon } from "lucide-react";

export type INavLink = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  badge?: string;
  badgeClasses?: string;
  items?: {
    title: string;
    url: string;
  }[];
};

export type TableActions<T> = {
  handleEdit?: (payload: T) => void | Promise<void>;
  handleDelete?: (payload: T) => void | Promise<void>;
  handleView?: (payload: T) => void | Promise<void>;
  [key: string]: any | undefined;
};

export type ColumnDefProps<T> = {
  dependencies?: any[];
  shouldVisibleActions?: boolean;
  skipColumns?: (keyof T)[];
} & TableActions<T>;

export interface BaseModel {
  createdAt: Date;
  updatedAt: Date;
}
