import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import ControlledInput from "@/components/form/ControlledInput";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import FormActions from "@/components/form/FormActions";
import { showMutationError } from "@/helpers/common";
import ControlledSelect from "@/components/form/ControlledSelect";
import {
  IPermissionSchema,
  permissionSchema,
} from "@/lib/validation/permission.valiadation";
import { permissionActionOptions } from "@/services/governance/permission.service";
import { commonHelpers } from "@/helpers";

const $defaultValues: Partial<IPermissionSchema> = {
  name: "",
  codename: "",
};

const PermissionForm = ({
  defaultValues = $defaultValues,
  handleSubmit,
  type = "add",
  handleClose,
}: {
  defaultValues?: Partial<IPermissionSchema>;
  handleSubmit: (values: IPermissionSchema) => Promise<any>;
  type?: "add" | "update";
  handleClose: () => void;
}) => {
  const form = useForm<IPermissionSchema>({
    defaultValues,
    resolver: zodResolver(permissionSchema),
  });

  const handleFormSubmit = async (values: IPermissionSchema) => {
    const id = toast.loading("Saving...");
    try {
      await handleSubmit({
        ...values,
        codename: `${values.codename}_${commonHelpers.slugify(values.name)}`,
      });
      form.reset({});
      handleClose();
      toast.success("Permission saved successfully");
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
        className="w-[80vw] h-full flex flex-col gap-4 md:gap-6 max-w-screen-sm"
      >
        <ControlledInput
          name="name"
          control={form.control}
          label="Permission Name:"
          type="text"
        />
        <ControlledSelect
          control={form.control}
          name="codename"
          label="Select Action:"
          options={permissionActionOptions as IFormLabel[]}
          description="Select Action for permission"
        />
        <ControlledInput
          control={form.control}
          name="content_type"
          type="number"
          label="Content Type:"
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

export default PermissionForm;
