import ControlledInput from "@/components/form/ControlledInput";
import ControlledSelect from "@/components/form/ControlledSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { IVoiceKnowledgeFormValues } from "@/types/voice-knowledge";
import type { ISite } from "@/types/site";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RISK_LEVELS } from "../utils/voiceKnowledge.constants";
import { TagListInput } from "./TagListInput";
import { VoiceKnowledgeRiskBadge } from "./VoiceKnowledgeRiskBadge";

const schema = z
  .object({
    title: z.string().min(1, "Title is required."),
    topic: z.string().optional(),
    task_type: z.string().optional(),
    asset_name: z.string().optional(),
    risk_level: z.string().optional(),
    problem: z.string().optional(),
    root_cause: z.string().optional(),
    recommended_action: z.string().optional(),
    lesson_learned: z.string().optional(),
    safety_warning: z.string().optional(),
    required_ppe: z.array(z.string()),
    stop_work_triggers: z.array(z.string()),
    sme_notes: z.string().optional(),
    site_id: z.string().optional(),
  })
  .refine(
    (data) =>
      Boolean(
        data.problem?.trim() ||
          data.recommended_action?.trim() ||
          data.lesson_learned?.trim() ||
          data.safety_warning?.trim()
      ),
    {
      message: "Provide at least one safety insight (problem, action, lesson, or warning).",
      path: ["problem"],
    }
  );

type Props = {
  defaultValues: IVoiceKnowledgeFormValues;
  confidenceScore?: number;
  saveStatusHint: string;
  sites?: ISite[];
  disabled?: boolean;
  formId: string;
  onSubmit: (values: IVoiceKnowledgeFormValues) => void;
};

export const VoiceKnowledgeForm = ({
  defaultValues,
  confidenceScore,
  saveStatusHint,
  sites = [],
  disabled,
  formId,
  onSubmit,
}: Props) => {
  const form = useForm<IVoiceKnowledgeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const riskLevel = form.watch("risk_level");

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <p className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {saveStatusHint}
        </p>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-950">Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <ControlledInput name="title" control={form.control} label="Title" disabled={disabled} />
            <ControlledInput name="topic" control={form.control} label="Topic" disabled={disabled} />
            <ControlledInput name="task_type" control={form.control} label="Task type" disabled={disabled} />
            <ControlledInput name="asset_name" control={form.control} label="Asset / location" disabled={disabled} />
            <ControlledSelect
              name="risk_level"
              control={form.control}
              label="Risk level"
              disabled={disabled}
              options={RISK_LEVELS.map((r) => ({
                label: r.charAt(0).toUpperCase() + r.slice(1),
                value: r,
              }))}
            />
            {sites.length > 0 && (
              <ControlledSelect
                name="site_id"
                control={form.control}
                label="Site (optional)"
                disabled={disabled}
                placeholder="Select site"
                options={[
                  { label: "No site selected", value: "" },
                  ...sites.map((s) => ({ label: s.name, value: s.id })),
                ]}
              />
            )}
            <div className="flex items-end gap-3">
              {riskLevel && <VoiceKnowledgeRiskBadge risk={riskLevel} />}
              {confidenceScore != null && (
                <span className="text-sm text-slate-500">
                  Confidence: {Math.round(confidenceScore * 100)}%
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-950">Safety analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(["problem", "root_cause", "recommended_action", "lesson_learned", "safety_warning"] as const).map(
              (field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={field}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="capitalize text-slate-700">
                        {field.replace(/_/g, " ")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...f}
                          disabled={disabled}
                          rows={3}
                          className="border-slate-200 bg-white text-slate-950"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-950">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="required_ppe"
              render={({ field }) => (
                <TagListInput
                  label="Required PPE"
                  values={field.value ?? []}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="e.g. Safety glasses"
                />
              )}
            />
            <FormField
              control={form.control}
              name="stop_work_triggers"
              render={({ field }) => (
                <TagListInput
                  label="Stop work triggers"
                  values={field.value ?? []}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="e.g. Signs of stored pressure"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-950">Original transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="sme_notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={disabled}
                      rows={6}
                      className="border-slate-200 bg-slate-50 font-mono text-sm text-slate-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
