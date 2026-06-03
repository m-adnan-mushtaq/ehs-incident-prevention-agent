import { ThemeInput } from "@/components/form/ThemeInput";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { IAdminSignupSchema } from "@/lib/validation/auth.validation";
import { Building2, Lock, Mail, User } from "lucide-react";
import type { Control } from "react-hook-form";

type Props = {
  isPending: boolean;
  control: Control<IAdminSignupSchema>;
};

export const AdminSignupForm = ({ isPending, control }: Props) => (
  <div className="flex flex-col gap-5">
    <FormField
      control={control}
      name="tenant_name"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <ThemeInput
              className="h-11 rounded-md border-slate-600/50 bg-slate-900/50 text-slate-100"
              startIcon={Building2}
              placeholder="Organization name"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-left" />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <ThemeInput
              className="h-11 rounded-md border-slate-600/50 bg-slate-900/50 text-slate-100"
              startIcon={User}
              placeholder="Your full name"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-left" />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <ThemeInput
              className="h-11 rounded-md border-slate-600/50 bg-slate-900/50 text-slate-100"
              startIcon={Mail}
              placeholder="Work email"
              type="email"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-left" />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <ThemeInput
              className="h-11 rounded-md border-slate-600/50 bg-slate-900/50 text-slate-100"
              startIcon={Lock}
              placeholder="Password"
              type="password"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-left" />
        </FormItem>
      )}
    />
    <Button
      disabled={isPending}
      type="submit"
      className="w-full bg-sky-600 hover:bg-sky-500 text-white"
    >
      {isPending ? "Creating account..." : "Create organization account"}
    </Button>
  </div>
);
