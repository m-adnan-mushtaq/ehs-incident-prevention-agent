import { z } from "zod";
import { numberSchema, stringSchema } from "./_base";
import { IRoleStatus } from "@/services/governance/role.service";

export const roleTypeSchema = z.object({
  name: stringSchema("Role type name", 3, 50),
});

export type IRoleTypeSchema = z.infer<typeof roleTypeSchema>;

export const roleSchema = z.object({
  name: stringSchema("Role name", 3, 50),
  role_type: numberSchema("Role type", 1),
  status: z.nativeEnum(IRoleStatus),
  users: z.array(z.coerce.number()).min(1, "At least one user is required."),
  permissions: z
    .array(z.coerce.number())
    .min(1, "At least one permission is required."),
});

export type IRoleSchema = z.infer<typeof roleSchema>;
