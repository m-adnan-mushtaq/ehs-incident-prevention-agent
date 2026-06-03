import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { Control } from "react-hook-form";
import type { IIncidentFormValues } from "../utils/incident-formatters";

type Props = {
  control: Control<IIncidentFormValues>;
  disabled?: boolean;
};

const FIELDS = ["root_cause", "corrective_action", "lessons_learned"] as const;

export const IncidentSafetyReviewFields = ({ control, disabled }: Props) => (
  <section className="space-y-4">
    <h3 className="text-sm font-semibold text-slate-950">Safety review</h3>
    {FIELDS.map((field) => (
      <FormField
        key={field}
        control={control}
        name={field}
        render={({ field: f }) => (
          <FormItem>
            <FormLabel className="capitalize">
              {field.replace(/_/g, " ")}
            </FormLabel>
            <FormControl>
              <Textarea
                {...f}
                disabled={disabled}
                rows={3}
                placeholder={
                  field === "lessons_learned"
                    ? "Capture the key lesson that should help prevent this from happening again."
                    : undefined
                }
                className="border-slate-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ))}
  </section>
);
