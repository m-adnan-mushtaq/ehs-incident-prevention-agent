import type { ICurrentUser, IRoleRef, UserRole } from "@/types/user";

export const getUserRole = (user: ICurrentUser | null): UserRole | null => {
  if (!user?.role) return null;
  if (typeof user.role === "string") return user.role as UserRole;
  return (user.role as IRoleRef).name as UserRole;
};

export const isAdmin = (user: ICurrentUser | null): boolean =>
  getUserRole(user) === "admin";

export const roleLabel: Record<UserRole, string> = {
  admin: "Administrator",
  sme: "Safety Manager",
  field_worker: "Field Worker",
};
