import LoginForm from "@/features/auth/components/login-form";
import { useLogin } from "@/features/auth/hooks/useLogin";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ILoginSchema, loginSchema } from "@/lib/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const defaultValues: ILoginSchema = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const form = useForm<ILoginSchema>({
    defaultValues,
    resolver: zodResolver(loginSchema),
  });
  const { mutate, isPending } = useLogin();

  return (
    <>
      <CardHeader className="px-0 pb-2 text-center">
        <CardTitle className="text-xl text-slate-100">Sign in</CardTitle>
        <CardDescription className="text-slate-500">
          Access your safety operations workspace
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit((data) => mutate(data))}>
            <LoginForm control={form.control} isPending={isPending} />
          </form>
        </Form>
      </CardContent>
    </>
  );
};

export default LoginPage;
