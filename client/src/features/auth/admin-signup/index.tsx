import { AdminSignupForm } from "@/features/auth/components/AdminSignupForm";
import { useAdminSignup } from "@/features/auth/hooks/useAdminSignup";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  adminSignupSchema,
  IAdminSignupSchema,
} from "@/lib/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";

const defaultValues: IAdminSignupSchema = {
  name: "",
  email: "",
  password: "",
  tenant_name: "",
};

const AdminSignupPage = () => {
  const form = useForm<IAdminSignupSchema>({
    defaultValues,
    resolver: zodResolver(adminSignupSchema),
  });
  const { mutate, isPending } = useAdminSignup();

  return (
    <>
      <CardHeader className="px-0 pb-2 text-center">
        <CardTitle className="text-xl text-slate-100">
          Organization onboarding
        </CardTitle>
        <CardDescription className="text-slate-500">
          Register your tenant and administrator account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit((data) => mutate(data))}>
            <AdminSignupForm control={form.control} isPending={isPending} />
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-sky-400 hover:text-sky-300"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </>
  );
};

export default AdminSignupPage;
