import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.");
// .regex(
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
//   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
// );

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required."),
  password: passwordSchema,
});

export type ILoginSchema = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required."),
});

export type IForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    new_password1: passwordSchema,
    new_password2: passwordSchema,
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    message: "Passwords must match",
    path: ["new_password2"], // The path where the error will be shown
  });

export type IResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const updatePasswordSchema = resetPasswordSchema;

export type IUpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

export const profileSchema = z.object({
  phone_number: z.string().optional(),
  about_me: z.string().optional(),
  gender: z.string(),
  country: z.string().optional(),
  city: z.string().optional(),
  profile_photo: z.any().optional(),
});

export type IProfileSchema = z.infer<typeof profileSchema>;

export const accountSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address").min(1, "Email is required."),
});

export type IAccountSchema = z.infer<typeof accountSchema>;

export const addUserSchema = accountSchema
  .extend({
    password1: passwordSchema,
    password2: passwordSchema,
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords must match",
    path: ["password2"], // The path where the error will be shown
  });

export type IAddUserSchema = z.infer<typeof addUserSchema>;

export const sendVerifyEmailSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required."),
});

export type ISendVerifyEmailSchema = z.infer<typeof sendVerifyEmailSchema>;
