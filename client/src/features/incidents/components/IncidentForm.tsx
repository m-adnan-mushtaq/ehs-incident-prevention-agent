import ControlledInput from "@/components/form/ControlledInput";
import ControlledSelect from "@/components/form/ControlledSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { IncidentSafetyReviewFields } from "./IncidentSafetyReviewFields";
import type { IIncident } from "@/types/incident";
import type { ISite } from "@/types/site";
import type { UserRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  INCIDENT_TYPES,
  SEVERITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "../utils/incident.constants";
import {
  emptyIncidentFormValues,
  incidentToFormValues,
  type IIncidentFormValues,
} from "../utils/incident-formatters";

const schema = z.object({
  site_id: z.string().min(1, "Site is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string(),
  incident_type: z.string(),
  task_type: z.string(),
  asset_name: z.string(),
  severity: z.string(),
  occurred_at: z.string(),
  root_cause: z.string(),
  corrective_action: z.string(),
  lessons_learned: z.string(),
  status: z.string(),
});

type Props = {
  incident?: IIncident;
  sites: ISite[];
  role: UserRole | null;
  loading?: boolean;
  onSubmit: (values: IIncidentFormValues) => Promise<void>;
  onClose: () => void;
  formId?: string;
  defaultValues?: IIncidentFormValues;
  hideActions?: boolean;
  confidenceScore?: number | null;
};

export const IncidentForm = ({
  incident,
  sites,
  role,
  loading,
  onSubmit,
  onClose,
  formId,
  defaultValues: externalDefaults,
  hideActions,
  confidenceScore,
}: Props) => {
  const isEdit = Boolean(incident);
  const showReviewFields = role === "admin" || role === "sme";
  const showStatus = isEdit && (role === "admin" || role === "sme");

  const resolvedDefaults = externalDefaults
    ?? (incident ? incidentToFormValues(incident) : emptyIncidentFormValues());

  const form = useForm<IIncidentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: resolvedDefaults,
  });

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
          form.reset();
          onClose();
        })}
        className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto pr-1"
      >
        {confidenceScore != null && (
          <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <span className="font-medium">AI confidence:</span>
            <span>{Math.round(confidenceScore * 100)}%</span>
          </div>
        )}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-950">Basic information</h3>
          <ControlledInput name="title" control={form.control} label="Title" disabled={loading} />
          <ControlledSelect
            name="site_id"
            control={form.control}
            label="Site"
            disabled={loading || isEdit}
            placeholder="Select site"
            options={sites.map((s) => ({ label: s.name, value: s.id }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledSelect
              name="incident_type"
              control={form.control}
              label="Incident type"
              disabled={loading}
              placeholder="Select type"
              options={INCIDENT_TYPES.map((t) => ({
                label: TYPE_LABELS[t],
                value: t,
              }))}
            />
            <ControlledSelect
              name="severity"
              control={form.control}
              label="Severity"
              disabled={loading}
              placeholder="Select severity"
              options={INCIDENT_SEVERITIES.map((s) => ({
                label: SEVERITY_LABELS[s],
                value: s,
              }))}
            />
          </div>
          <ControlledInput
            name="occurred_at"
            control={form.control}
            label="Occurred at"
            type="datetime-local"
            disabled={loading}
          />
          {showStatus && (
            <ControlledSelect
              name="status"
              control={form.control}
              label="Status"
              disabled={loading}
              options={INCIDENT_STATUSES.map((s) => ({
                label: STATUS_LABELS[s],
                value: s,
              }))}
            />
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-950">Work context</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledInput name="task_type" control={form.control} label="Task type" disabled={loading} />
            <ControlledInput name="asset_name" control={form.control} label="Asset / location" disabled={loading} />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-950">What happened</h3>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={loading}
                    rows={4}
                    placeholder="Describe what happened, where it happened, and what conditions were present."
                    className="border-slate-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {showReviewFields && (
          <IncidentSafetyReviewFields control={form.control} disabled={loading} />
        )}

        {!hideActions && (
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update incident" : "Report incident"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
