import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.");

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required."),
  password: passwordSchema,
});

export type ILoginSchema = z.infer<typeof loginSchema>;

export const adminSignupSchema = z.object({
  name: z.string().min(1, "Organization contact name is required."),
  email: z.string().email("Invalid email address").min(1, "Email is required."),
  password: passwordSchema,
  tenant_name: z.string().min(1, "Organization name is required."),
});

export type IAdminSignupSchema = z.infer<typeof adminSignupSchema>;
