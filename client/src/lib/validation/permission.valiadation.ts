import { z } from "zod";
import { stringSchema } from "./_base";

export const permissionSchema = z.object({
  name: stringSchema("Permission name", 3, 50),
  codename: z.string(),
  content_type: z.coerce.number(),
});

export type IPermissionSchema = z.infer<typeof permissionSchema>;
