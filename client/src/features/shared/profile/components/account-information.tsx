import ControlledInput from "@/components/form/ControlledInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { showMutationError } from "@/helpers/common";
import {
  accountSchema,
  IAccountSchema,
} from "@/lib/validation/auth.validation";
import { authService } from "@/services";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AccountInformation = () => {
  const form = useForm<IAccountSchema>({
    resolver: zodResolver(accountSchema),
  });

  const { user, updateUser } = useAuthStore();

  //api calls
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.updatePersonalInformation,
  });

  useEffect(() => {
    if (user) {
      form.setValue("first_name", user.first_name);
      form.setValue("last_name", user.last_name);
      form.setValue("email", user.email);
    }
  }, [user]);

  const handleSubmit = async (data: IAccountSchema) => {
    try {
      const result = await mutateAsync(data);
      updateUser(result.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      showMutationError(error);
    }
  };

  return (
    <>
      <h3 className="font-semibold mb-6 text-xl">Account Information</h3>
      <Form {...form}>
        <form
          noValidate
          autoComplete="nope"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-2 gap-4 md:gap-6 items-center w-full"
        >
          <ControlledInput
            control={form.control}
            name="first_name"
            label="First Name"
          />
          <ControlledInput
            control={form.control}
            name="last_name"
            label="Last Name"
          />

          <div className="col-span-2">
            <ControlledInput
              control={form.control}
              name="email"
              label="Email Address"
              disabled
            />
          </div>

          <div className="col-span-2 text-right">
            <Button disabled={isPending} type="submit">
              {isPending ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AccountInformation;
