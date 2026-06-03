import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ILoginSchema, loginSchema } from "@/lib/validation/auth.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { showMutationError } from "@/helpers/common";
import { TOKEN_PREFIX } from "@/constants/common";
import { apiInstance } from "@/services/_base";
import { useAuthStore } from "@/store/auth";
import LoginForm from "../components/login-form";
import queryClient from "@/config/query-client";

const defaultValues: ILoginSchema = {
  email: "",
  password: "",
};

const LoginPage = () => {
  //form hooks
  const form = useForm<ILoginSchema>({
    defaultValues,
    resolver: zodResolver(loginSchema),
  });

  //store hooks
  const setUser = useAuthStore((store) => store.setUser);

  //api calls
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.login,
  });

  //event handlers
  const handleSubmit = async (data: ILoginSchema) => {
    try {
      const result = await mutateAsync(data);
      if ("access_token" in result.data) {
        localStorage.setItem(TOKEN_PREFIX, result.data.access_token);
        apiInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${result.data.access_token}`;
      }
      queryClient.resetQueries();
      setUser(result.data.user);
    } catch (error) {
      showMutationError(error);
    }
  };

  //rendering
  return (
    <>
      <CardHeader className="text-center mt-4">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <LoginForm control={form.control} isPending={isPending} />
          </form>
        </Form>
      </CardContent>
    </>
  );
};

export default LoginPage;
