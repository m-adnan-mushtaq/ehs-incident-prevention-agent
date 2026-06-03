import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  forgotPasswordSchema,
  IForgotPasswordSchema,
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
import { Mail } from "lucide-react";
import SuccessEmail from "../success-email";
import toast from "react-hot-toast";

const defaultValues: IForgotPasswordSchema = {
  email: "",
};

const ForgotPassword = () => {
  //form hooks
  const form = useForm<IForgotPasswordSchema>({
    defaultValues,
    resolver: zodResolver(forgotPasswordSchema),
  });

  //api calls
  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: authService.forgotPassword,
  });

  //event handlers
  const handleSubmit = async (data: IForgotPasswordSchema) => {
    try {
      await mutateAsync(data);
      toast.success("Email sent successfully, check your inbox.");
    } catch (error) {
      showMutationError(error);
    }
  };

  //rendering

  if (isSuccess && !isError) {
    return (
      <SuccessEmail
        email={form.getValues().email}
        handleResendEmail={() => {
          handleSubmit({ email: form.getValues().email });
        }}
      />
    );
  }
  return (
    <>
      <CardHeader className="text-center mt-4">
        <CardTitle className="text-2xl"> Password Reset</CardTitle>
        <CardDescription>
          Enter the email address you use to log in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex  flex-col gap-6">
              <FormField
                control={form.control}
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

export default ForgotPassword;
