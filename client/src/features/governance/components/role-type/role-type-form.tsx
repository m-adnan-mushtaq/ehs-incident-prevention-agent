import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import ControlledInput from "@/components/form/ControlledInput";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import FormActions from "@/components/form/FormActions";
import { showMutationError } from "@/helpers/common";
import {
  IRoleTypeSchema,
  roleTypeSchema,
} from "@/lib/validation/role.validation";

const $defaultValues: Partial<IRoleTypeSchema> = {
  name: "",
};

const RoleTypeForm = ({
  defaultValues = $defaultValues,
  handleSubmit,
  type = "add",
  handleClose,
}: {
  defaultValues?: Partial<IRoleTypeSchema>;
  handleSubmit: (values: IRoleTypeSchema) => Promise<any>;
  type?: "add" | "update";
  handleClose: () => void;
}) => {
  const form = useForm<IRoleTypeSchema>({
    defaultValues,
    resolver: zodResolver(roleTypeSchema),
  });

  const handleFormSubmit = async (values: IRoleTypeSchema) => {
    const id = toast.loading("Saving...");
    try {
      await handleSubmit(values);
      form.reset({});
      handleClose();
      toast.success("Role Type saved successfully");
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
        className="w-[80vw] h-full flex flex-col gap-4 max-w-screen-sm"
      >
        <div className="col-span-2">
          <ControlledInput
            name="name"
            control={form.control}
            label="Enter Role Type:"
            type="text"
          />
        </div>
        <FormActions
          loading={form.formState.isSubmitting}
          position="right"
          actions={{
            save: {
              visible: true,
              label: type === "add" ? "Add Role Type" : "Update Role Type",
              onClick: () => {},
              variant: "default",
            },
            cancel: {
              visible: true,
              label: "Cancel",
              onClick: handleClose,
              variant: "ghost",
            },
          }}
        />
      </form>
    </Form>
  );
};

export default RoleTypeForm;
