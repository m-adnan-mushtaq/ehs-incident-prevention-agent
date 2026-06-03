import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import ControlledInput from "@/components/form/ControlledInput";
import toast from "react-hot-toast";
import {
  addUserSchema,
  IAddUserSchema,
} from "@/lib/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import FormActions from "@/components/form/FormActions";
import { showMutationError } from "@/helpers/common";

const $defaultValues: Partial<IAddUserSchema> = {
  first_name: "",
  last_name: "",
  email: "",
  password1: "",
  password2: "",
};

const UserForm = ({
  defaultValues = $defaultValues,
  handleSubmit,
  type = "add",
  handleClose,
}: {
  defaultValues?: Partial<IAddUserSchema>;
  handleSubmit: (values: IAddUserSchema) => Promise<any>;
  type?: "add" | "update";
  handleClose: () => void;
}) => {
  const form = useForm<IAddUserSchema>({
    defaultValues,
    resolver: zodResolver(addUserSchema),
  });

  const handleFormSubmit = async (values: IAddUserSchema) => {
    const id = toast.loading("Saving...");
    try {
      await handleSubmit(values);
      form.reset({});
      handleClose();
    } catch (error) {
      showMutationError(error);
    } finally {
      toast.dismiss(id);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="w-[80vw] max-w-lg space-y-4"
      >
        <ControlledInput
          name="first_name"
          control={form.control}
          label="First Name:"
          type="text"
        />

        <ControlledInput
          name="last_name"
          control={form.control}
          label="Last Name:"
          type="text"
        />

        <ControlledInput
          name="email"
          control={form.control}
          label="Email:"
          type="email"
        />

        <ControlledInput
          name="password1"
          control={form.control}
          label="Password:"
          type="password"
        />

        <ControlledInput
          name="password2"
          control={form.control}
          label="Confirm Password:"
          type="password"
        />

        <div className="col-span-2">
          <FormActions
            loading={form.formState.isSubmitting}
            position="right"
            actions={{
              save: {
                visible: true,
                label: type === "add" ? "Add User" : "Update User",
                onClick: () => {},
                variant: "default",
              },
              cancel: {
                visible: type === "update",
                label: "Cancel",
                onClick: handleClose,
                variant: "ghost",
              },
            }}
          />
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
