import ControlledInput from "@/components/form/ControlledInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { showMutationError } from "@/helpers/common";
import {
  IUpdatePasswordSchema,
  updatePasswordSchema,
} from "@/lib/validation/auth.validation";
import { authService } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SecurityInformation = () => {
  const form = useForm<IUpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
  });

  //api calls
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.updatePassword,
  });

  const handleSubmit = async (data: IUpdatePasswordSchema) => {
    try {
      const result = await mutateAsync(data);
      toast.success(result?.data?.detail || "Password updated successfully");
      form.reset();
    } catch (error) {
      showMutationError(error);
    }
  };

  return (
    <>
      <h3 className="font-semibold mb-6 text-xl">Password & Security</h3>
      <Form {...form}>
        <form
          noValidate
          autoComplete="nope"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4 md:gap-6 w-full"
        >
          <ControlledInput
            control={form.control}
            name="new_password1"
            label="New Password"
            type="password"
          />
          <ControlledInput
            control={form.control}
            name="new_password2"
            label="Confirm Password"
            type="password"
          />
          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 text-sm font-medium">Password Requirements</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>At least 8 characters long</li>
              <li>Must include at least one uppercase letter</li>
              <li>Must include at least one number</li>
              <li>Must include at least one special character</li>
            </ul>
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

export default SecurityInformation;
