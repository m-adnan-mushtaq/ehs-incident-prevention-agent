import ControlledInput from "@/components/form/ControlledInput";
import ControlledSelect from "@/components/form/ControlledSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { ICreateSitePayload, ISite, IUpdateSitePayload, SiteStatus } from "@/types/site";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Site name is required."),
  code: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "suspended", "archived"]),
});

type SiteFormProps = {
  site?: ISite;
  loading?: boolean;
  onSubmit: (values: ICreateSitePayload | IUpdateSitePayload) => Promise<void>;
  onClose: () => void;
};

export const SiteForm = ({ site, loading, onSubmit, onClose }: SiteFormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: site?.name ?? "",
      code: site?.code ?? "",
      address: site?.address ?? "",
      description: site?.description ?? "",
      status: (site?.status as SiteStatus) ?? "active",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
          form.reset();
          onClose();
        })}
        className="flex min-w-[320px] flex-col gap-4"
      >
        <ControlledInput name="name" control={form.control} label="Site name" />
        <ControlledInput name="code" control={form.control} label="Site code" />
        <ControlledInput name="address" control={form.control} label="Location / address" />
        <ControlledInput
          name="description"
          control={form.control}
          label="Description"
        />
        <ControlledSelect
          name="status"
          control={form.control}
          label="Status"
          options={[
            { label: "Active", value: "active" },
            { label: "Suspended", value: "suspended" },
            { label: "Archived", value: "archived" },
          ]}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : site ? "Update site" : "Create site"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
