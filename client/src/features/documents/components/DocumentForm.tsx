import ControlledFileInput from "@/components/form/ControlledFileInput";
import ControlledInput from "@/components/form/ControlledInput";
import ControlledSelect from "@/components/form/ControlledSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ISite } from "@/types/site";
import type { IUploadDocumentPayload, SourceScope } from "@/types/document";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    title: z.string().min(1, "Title is required."),
    source_scope: z.enum(["global", "site"]),
    description: z.string().optional(),
    document_type: z.string().optional(),
    topic: z.string().optional(),
    site_ids: z.string().optional(),
    file: z.any(),
  })
  .superRefine((data, ctx) => {
    if (data.source_scope === "site" && !data.site_ids?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Select at least one site for site-scoped documents.",
        path: ["site_ids"],
      });
    }
  });

type DocumentFormProps = {
  sites: ISite[];
  loading?: boolean;
  onSubmit: (payload: IUploadDocumentPayload) => Promise<void>;
  onClose: () => void;
};

export const DocumentForm = ({
  sites,
  loading,
  onSubmit,
  onClose,
}: DocumentFormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      source_scope: "global" as SourceScope,
      description: "",
      document_type: "",
      topic: "",
      site_ids: "",
      file: undefined,
    },
  });

  const sourceScope = form.watch("source_scope");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const file = values?.file?.[0];
          if (!file) {
            form.setError("file", { message: "Document file is required." });
            return;
          }

          await onSubmit({
            title: values.title,
            source_scope: values.source_scope,
            description: values.description,
            document_type: values.document_type,
            topic: values.topic,
            site_ids: values.site_ids,
            file,
          });
          form.reset();
          onClose();
        })}
        className="flex flex-col gap-4 px-4"
      >
        <Alert className="border-blue-200 bg-blue-50 text-blue-900">
          <AlertDescription className="text-sm leading-6">
            Upload SOPs, manuals, checklists, policies, or regulatory guidance.
            Safety Operations AI will process the file into searchable,
            citation-ready safety knowledge.
          </AlertDescription>
        </Alert>
        <ControlledInput name="title" control={form.control} label="Title" />
        <ControlledSelect
          name="document_type"
          control={form.control}
          label="Document type"
          placeholder="Select type"
          options={[
            { label: "SOP", value: "sop" },
            { label: "Manual", value: "manual" },
            { label: "Checklist", value: "checklist" },
            { label: "Policy", value: "policy" },
            { label: "Regulatory Guidance", value: "regulatory_guidance" },
          ]}
        />
        <ControlledSelect
          name="source_scope"
          control={form.control}
          label="Source scope"
          options={[
            { label: "Global (tenant-wide)", value: "global" },
            { label: "Site-specific", value: "site" },
          ]}
        />
        {sourceScope === "site" && (
          <ControlledSelect
            name="site_ids"
            control={form.control}
            label="Site"
            placeholder="Select site"
            options={sites.map((s) => ({ label: s.name, value: s.id }))}
          />
        )}
        <ControlledInput name="topic" control={form.control} label="Topic" />
        <ControlledInput
          name="description"
          control={form.control}
          label="Description"
        />
        <ControlledFileInput
          name="file"
          control={form.control}
          label="File"
          maxFiles={1}
          accept={{
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"],
            "text/plain": [".txt"],
          }}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload document"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
