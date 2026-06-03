import { UserIdentityStatus } from "@/services/governance/user-identity.service";
import { z } from "zod";
import { stringSchema } from "./_base";

export const userIdentitySchema = z.object({
  name: stringSchema("User identity name", 3, 50),
  user: z.coerce.number(),
  department: z.coerce.number(),
  status: z.nativeEnum(UserIdentityStatus),
});

export type IUserIdentitySchema = z.infer<typeof userIdentitySchema>;
