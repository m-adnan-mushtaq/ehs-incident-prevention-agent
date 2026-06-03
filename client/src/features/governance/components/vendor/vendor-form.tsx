import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import ControlledInput from "@/components/form/ControlledInput";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import FormActions from "@/components/form/FormActions";
import { showMutationError } from "@/helpers/common";
import {
  IVendorSchema,
  vendorSchema,
} from "@/lib/validation/vendor.validation";
import ControlledSelect from "@/components/form/ControlledSelect";
import {
  vendorClassificationOptions,
  vendorComplianceStatusOptions,
  vendorRiskLevelOptions,
} from "@/services/governance/vendor.service";
import ControlledDateInput from "@/components/form/ControlledDateInput";
import ControlledCheckbox from "@/components/form/ControlledCheckbox";
import ControlledTextArea from "@/components/form/ControlledTextArea";
import { useGetAllSectorOptions, useGetAllUserOptions } from "../../queries";
import ErrorMsg from "@/components/shared/error-msg";
import { commonHelpers } from "@/helpers";

const $defaultValues: Partial<IVendorSchema> = {
  name: "",
  description: "",
};

const VendorForm = ({
  defaultValues = $defaultValues,
  handleSubmit,
  type = "add",
  handleClose,
}: {
  defaultValues?: Partial<IVendorSchema>;
  handleSubmit: (values: IVendorSchema) => Promise<any>;
  type?: "add" | "update";
  handleClose: () => void;
}) => {
  //api calls
  const { data: userOptions = [], isError: userError } = useGetAllUserOptions();
  const { data: sectorOptions = [], isError: sectorError } =
    useGetAllSectorOptions();

  const form = useForm<IVendorSchema>({
    defaultValues,
    resolver: zodResolver(vendorSchema),
  });

  const handleFormSubmit = async (values: IVendorSchema) => {
    const id = toast.loading("Saving...");
    try {
      await handleSubmit({
        ...values,
        start_date: commonHelpers.formatApiDate(values.start_date) as any,
        end_date: commonHelpers.formatApiDate(values.end_date) as any,
      });
      form.reset({});
      handleClose();
      toast.success("Vendor saved successfully");
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
        className="w-[80vw] h-full flex flex-col gap-4 max-w-screen-sm"
      >
        <div className="gap-4 pb-1 flex-1 overflow-auto grid grid-cols-1 sm:grid-cols-2 pr-2">
          <div className="col-span-2">
            <ControlledInput
              name="name"
              control={form.control}
              label="Vendor Name:"
              type="text"
            />
          </div>
          <div className="col-span-2">
            <ControlledSelect
              name="risk_level"
              control={form.control}
              label="Risk Level:"
              options={vendorRiskLevelOptions}
            />
          </div>
          <div className="col-span-2">
            <ControlledSelect
              name="compliance_status"
              control={form.control}
              label="Compliance Status:"
              options={vendorComplianceStatusOptions}
            />
          </div>
          <ControlledDateInput
            name="start_date"
            control={form.control}
            label="Contract Start Date:"
            calendarProps={{
              disabled: {
                before: new Date(defaultValues?.end_date || new Date()),
              },
            }}
          />

          <ControlledDateInput
            name="end_date"
            control={form.control}
            label="Contract End Date:"
            calendarProps={{
              disabled: {
                before: new Date(defaultValues?.start_date || new Date()),
              },
            }}
          />
          <div className="col-span-2">
            <ControlledCheckbox
              name="access_required"
              control={form.control}
              label="Access Required:"
            />
          </div>

          <ControlledSelect
            name="classfication"
            label="Data Classification"
            control={form.control}
            options={vendorClassificationOptions}
          />

          <div className="col-span-2">
            <ControlledSelect
              control={form.control}
              name="department"
              label="Select Sector:"
              options={sectorOptions as IFormLabel[]}
              description="Select Sector to be associated with vendor"
            />
          </div>

          <div className="col-span-2">
            <ControlledSelect
              control={form.control}
              name="contact_person"
              label="Select Contact Person:"
              options={userOptions as IFormLabel[]}
            />
          </div>
          <div className="col-span-2">
            <ControlledTextArea
              name="description"
              control={form.control}
              label="Notes /Description:"
            />
          </div>
        </div>
        <FormActions
          loading={form.formState.isSubmitting}
          position="right"
          actions={{
            save: {
              visible: true,
              label: type === "add" ? "Add Vendor" : "Update Vendor",
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

export default VendorForm;
