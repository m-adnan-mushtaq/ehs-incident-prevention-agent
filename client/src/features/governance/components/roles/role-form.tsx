import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import ControlledInput from "@/components/form/ControlledInput";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import FormActions from "@/components/form/FormActions";
import { showMutationError } from "@/helpers/common";
import { useGetAllRoleTypeOptions, useGetAllUserOptions } from "../../queries";
import ErrorMsg from "@/components/shared/error-msg";
import ControlledSelect from "@/components/form/ControlledSelect";
import { roleStatusOptions } from "@/services/governance/role.service";
import ControlledMultiSelect from "@/components/form/ControlledMultiSelect";
import { IRoleSchema, roleSchema } from "@/lib/validation/role.validation";
import { Link } from "react-router";
import PermissionMatrix from "./permission-form";

const $defaultValues: Partial<IRoleSchema> = {
  name: "",
  permissions: [],
  users: [],
};

const RolesForm = ({
  defaultValues = $defaultValues,
  handleSubmit,
  type = "add",
  handleClose,
}: {
  defaultValues?: Partial<IRoleSchema>;
  handleSubmit: (values: IRoleSchema) => Promise<any>;
  type?: "add" | "update";
  handleClose: () => void;
}) => {
  //api calls
  const { data: userOptions = [], isError: userError } = useGetAllUserOptions();
  const { data: roleTypeOptions = [], isError: roleTypeError } =
    useGetAllRoleTypeOptions();

  const form = useForm<IRoleSchema>({
    defaultValues: {
      ...defaultValues,
    },
    resolver: zodResolver(roleSchema),
  });

  const handleFormSubmit = async (values: IRoleSchema) => {
    const id = toast.loading("Saving...");
    try {
      await handleSubmit(values);
      form.reset({});
      handleClose();
      toast.success("Role saved successfully");
    } catch (error) {
      showMutationError(error);
    } finally {
      toast.dismiss(id);
    }
  };

  console.log("form.getValues()", form.getValues());
  console.log("form.defaultValues", defaultValues);

  if (userError || roleTypeError) {
    return <ErrorMsg message="Failed to load user or role options" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="w-[80vw] h-full flex flex-col gap-4 md:gap-6 max-w-screen-xl"
      >
        <ControlledInput
          name="name"
          control={form.control}
          label="Enter Name:"
          type="text"
        />
        {roleTypeOptions?.length ? (
          <ControlledSelect
            control={form.control}
            name="role_type"
            label="Select Role Type:"
            options={roleTypeOptions as IFormLabel[]}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">
              No role types available
            </span>
            <Link
              to="/dashboard/role-types"
              className="text-sm text-primary underline"
            >
              Add Role Types
            </Link>
          </div>
        )}
        <ControlledMultiSelect
          control={form.control}
          name="users"
          label="Select Users:"
          options={userOptions as IFormLabel[]}
          description="Select Users to assign role to"
        />
        <ControlledSelect
          control={form.control}
          name="status"
          options={roleStatusOptions}
          label="Select Status:"
        />
        <div className="max-h-full overflow-auto">
          <PermissionMatrix />
        </div>
        <FormActions
          loading={form.formState.isSubmitting}
          position="right"
          actions={{
            save: {
              visible: true,
              label: type === "add" ? "Add Role" : "Update Role",
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

export default RolesForm;
