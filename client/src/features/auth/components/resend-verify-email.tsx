import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ISendVerifyEmailSchema,
  sendVerifyEmailSchema,
} from "@/lib/validation/auth.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLabel } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { showMutationError } from "@/helpers/common";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ThemeInput } from "@/components/form/ThemeInput";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const defaultValues: ISendVerifyEmailSchema = {
  email: "",
};

const ResendVerificationEmail = () => {
  //form hooks
  const form = useForm<ISendVerifyEmailSchema>({
    defaultValues,
    resolver: zodResolver(sendVerifyEmailSchema),
  });
  const navigate = useNavigate();

  //api calls
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.resendVerificationEmail,
  });

  //event handlers
  const handleSubmit = async (data: ISendVerifyEmailSchema) => {
    try {
      const result = await mutateAsync(data.email);
      toast.success(
        result.data?.detail || "Email sent successfully, check your inbox."
      );

      navigate("/login");
    } catch (error) {
      showMutationError(error);
    }
  };

  //rendering
  return (
    <div>
      <CardHeader className="text-center mt-4">
        <CardTitle className="text-2xl">Resend Verification</CardTitle>
        <CardDescription>
          Having trouble logging in? Don&apos;t worry, we&apos;ll send you a
          verification email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex mt-4 md:mt-8 flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your email:</FormLabel>
                    <FormControl>
                      <ThemeInput
                        className="rounded-md h-12 text-[1rem]"
                        startIcon={Mail}
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Resending..." : "Resend"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};

export default ResendVerificationEmail;
