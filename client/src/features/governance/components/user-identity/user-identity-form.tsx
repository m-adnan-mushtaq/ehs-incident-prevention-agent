import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import ControlledInput from "@/components/form/ControlledInput";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import FormActions from "@/components/form/FormActions";
import { showMutationError } from "@/helpers/common";
import {
  IUserIdentitySchema,
  userIdentitySchema,
} from "@/lib/validation/user-identity.validation";
import { useGetAllSectorOptions, useGetAllUserOptions } from "../../queries";
import ErrorMsg from "@/components/shared/error-msg";
import ControlledSelect from "@/components/form/ControlledSelect";
import { userIdentityStatusOptions } from "@/services/governance/user-identity.service";

const $defaultValues: Partial<IUserIdentitySchema> = {
  name: "",
};

const UserIdentityForm = ({
  defaultValues = $defaultValues,
  handleSubmit,
  type = "add",
  handleClose,
}: {
  defaultValues?: Partial<IUserIdentitySchema>;
  handleSubmit: (values: IUserIdentitySchema) => Promise<any>;
  type?: "add" | "update";
  handleClose: () => void;
}) => {
  //api calls
  const { data: userOptions = [], isError: userError } = useGetAllUserOptions();
  const { data: sectorOptions = [], isError: sectorError } =
    useGetAllSectorOptions();

  const form = useForm<IUserIdentitySchema>({
    defaultValues,
    resolver: zodResolver(userIdentitySchema),
  });

  const handleFormSubmit = async (values: IUserIdentitySchema) => {
    const id = toast.loading("Saving...");
    try {
      await handleSubmit(values);
      form.reset({});
      handleClose();
      toast.success("User Identity saved successfully");
    } catch (error) {
      showMutationError(error);
    } finally {
      toast.dismiss(id);
    }
  };

  if (userError || sectorError) {
    return <ErrorMsg message="Failed to load user or sector options" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="w-[80vw] h-full flex flex-col gap-4 md:gap-6 max-w-screen-sm"
      >
        <ControlledInput
          name="name"
          control={form.control}
          label="Enter Name:"
          type="text"
        />
        <ControlledSelect
          control={form.control}
          name="department"
          label="Select Sector:"
          options={sectorOptions as IFormLabel[]}
          description="Select Sector to be associated with user"
        />
        <ControlledSelect
          control={form.control}
          name="user"
          label="Select User:"
          options={userOptions as IFormLabel[]}
          description="Select User to be associated with sector"
        />
        <ControlledSelect
          control={form.control}
          name="status"
          options={userIdentityStatusOptions}
          label="Select Status:"
        />
        <FormActions
          loading={form.formState.isSubmitting}
          position="right"
          actions={{
            save: {
              visible: true,
              label:
                type === "add" ? "Add User Identity" : "Update User Identity",
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

export default UserIdentityForm;
