import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router";
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
                className="rounded-md h-12 text-[1rem]"
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
                className="h-12 rounded-md text-[1rem]"
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
        to="/forgot-password"
        className="font-medium text-gray-600 underline"
      >
        Forgot Password?
      </Link>
      <Button disabled={isPending} type="submit" className="w-full">
        {isPending ? "Logging in..." : "Login"}
      </Button>
    </div>
  );
};

export default LoginForm;
