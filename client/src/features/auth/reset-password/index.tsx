import { Navigate, useNavigate, useParams } from "react-router";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IResetPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { showMutationError } from "@/helpers/common";
import { Button } from "@/components/ui/button";
import { ThemeInput } from "@/components/form/ThemeInput";
import { Eye, EyeOff, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const defaultValues: IResetPasswordSchema = {
  new_password1: "",
  new_password2: "",
};

const ResetPassword = () => {
  //hooks
  const params = useParams<{
    uid: string;
    token: string;
  }>();
  const navigate = useNavigate();

  const [visiblePasswordType, setVisiblePasswordType] = useState({
    password: false,
    confirmPassword: false,
  });

  //form hooks
  const form = useForm<IResetPasswordSchema>({
    defaultValues,
    resolver: zodResolver(resetPasswordSchema),
  });

  //api calls
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.resetPassword,
  });

  //event handlers
  const handleSubmit = async (data: IResetPasswordSchema) => {
    try {
      if (!params.uid || !params.token) return;
      const result = await mutateAsync({
        ...data,
        uid: params.uid,
        token: params.token,
      });
      toast.success(result.data.detail);
      navigate("/");
    } catch (error) {
      showMutationError(error);
    }
  };

  if (!params.uid || !params.token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <CardHeader className="text-center mt-4">
        <CardTitle className="text-2xl"> Reset Password</CardTitle>
        <CardDescription>Enter new password for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex  flex-col gap-6">
              <FormField
                control={form.control}
                name="new_password1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ThemeInput
                        className="rounded-md h-12 text-[1rem]"
                        startIcon={Lock}
                        placeholder="Password123"
                        type={
                          visiblePasswordType.password ? "text" : "password"
                        }
                        endIcon={visiblePasswordType.password ? Eye : EyeOff}
                        endIconProps={{
                          className: "cursor-pointer",
                          onClick: () => {
                            setVisiblePasswordType({
                              ...visiblePasswordType,
                              password: !visiblePasswordType.password,
                            });
                          },
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ThemeInput
                        className="rounded-md h-12 text-[1rem]"
                        startIcon={Lock}
                        placeholder="Confirm Password"
                        type={
                          visiblePasswordType.confirmPassword
                            ? "text"
                            : "password"
                        }
                        endIcon={
                          visiblePasswordType.confirmPassword ? Eye : EyeOff
                        }
                        endIconProps={{
                          className: "cursor-pointer",
                          onClick: () => {
                            setVisiblePasswordType({
                              ...visiblePasswordType,
                              confirmPassword:
                                !visiblePasswordType.confirmPassword,
                            });
                          },
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
};

export default ResetPassword;
