import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "@tanstack/react-router";
import { ThemeInput } from "@/components/form/ThemeInput";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Control } from "react-hook-form";
import { ILoginSchema } from "@/lib/validation/auth.validation";

type Props = {
  isPending: boolean;
  control: Control<ILoginSchema>;
};
const LoginForm = ({ isPending, control }: Props) => {
  return (
    <div className="flex  flex-col gap-6">
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ThemeInput
                className="h-11 rounded-md border-slate-200 bg-white text-[1rem] text-slate-950"
                startIcon={Mail}
                placeholder="Email"
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
                className="h-11 rounded-md border-slate-200 bg-white text-[1rem] text-slate-950"
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
      <Link
        to="/auth/login"
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        Forgot password? Contact your administrator.
      </Link>
      <Button
        disabled={isPending}
        type="submit"
        className="w-full"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </div>
  );
};

export default LoginForm;
