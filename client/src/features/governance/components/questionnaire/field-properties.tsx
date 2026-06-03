import { useFormBuilderStore } from "@/store/form-builder";
import { useFieldArray, useForm } from "react-hook-form";
import { FormField } from "../../types/form-builder";
import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { MeshSVg } from "@/assets/svgs";
import ControlledInput from "@/components/form/ControlledInput";
import { INPUT_TYPES } from "@/constants/form-builder";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import useDebounce from "@/hooks/use-debounce-fn";
import ControlledCheckbox from "@/components/form/ControlledCheckbox";

const defaultOption = {
  label: "New Option",
  value: "option",
};

const FieldProperties = () => {
  const getActiveQuestion = useFormBuilderStore(
    (store) => store.getActiveQuestion
  );
  const updateQuestion = useFormBuilderStore((store) => store.updateQuestion);
  const activeQuestion = getActiveQuestion();
  //subscribe to formJson
  useFormBuilderStore((store) => store.formJson);

  const form = useForm<FormField>({
    defaultValues: activeQuestion,
    mode: "onBlur",
  });

  const watchedValues = form.watch();

  const debouncedUpdateQuestion = useDebounce((values: FormField) => {
    if (!activeQuestion) return;
    const { label, ...rest } = values;
    updateQuestion(rest, activeQuestion.stepId);
  }, 500);

  useEffect(() => {
    debouncedUpdateQuestion(watchedValues);
  }, [JSON.stringify(watchedValues)]);

  const handleSubmit = (values: FormField) => {
    if (!activeQuestion) return;
    updateQuestion(values, activeQuestion?.stepId);
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  //content goes here

  if (!activeQuestion)
    return (
      <div className="flex flex-col gap-4 h-full">
        <h2>Please select a field</h2>
        <MeshSVg />
      </div>
    );

  return (
    <Form {...form}>
      <form
        className="flex flex-col h-full gap-4"
        noValidate
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h3 className="text-lg font-semibold text-primary">Field Properties</h3>
        <ControlledInput
          name="description"
          control={form.control}
          label="Description (if any):"
          placeholder="Enter Description"
        />
        <ControlledInput
          name="placeholder"
          control={form.control}
          label="Placeholder:"
          placeholder="Enter Placeholder"
        />

        <ControlledCheckbox
          name="required"
          control={form.control}
          label="Mark as Required"
        />
        {[INPUT_TYPES.TEXTAREA, INPUT_TYPES.TEXTFIELD].includes(
          activeQuestion.type as any
        ) && (
          <>
            <ControlledInput
              name="minLength"
              control={form.control}
              label="Min Characters"
              type="number"
              placeholder="Enter min value"
            />
            <ControlledInput
              name="maxLength"
              control={form.control}
              label="Max Characters"
              type="number"
              placeholder="Enter max value"
            />
          </>
        )}
        {[INPUT_TYPES.SLIDER, INPUT_TYPES.NUMBER].includes(
          activeQuestion.type as any
        ) && (
          <>
            <ControlledInput
              name="min"
              control={form.control}
              label="Min"
              type="number"
              placeholder="Enter min value"
            />
            <ControlledInput
              name="max"
              control={form.control}
              label="Max"
              type="number"
              placeholder="Enter max value"
            />
          </>
        )}
        {[INPUT_TYPES.FILE_UPLOAD].includes(activeQuestion.type as any) && (
          <>
            <ControlledInput
              name="maxSize"
              control={form.control}
              label="Max File Size (KB)"
              type="number"
              placeholder="Enter max value"
            />
          </>
        )}

        {[
          INPUT_TYPES.SELECT,
          INPUT_TYPES.RADIOGROUP,
          INPUT_TYPES.MULTI_SELECT,
        ].includes(activeQuestion.type as any) && (
          <div className="grid grid-cols-3 gap-2 border p-2 rounded-xl items-center justify-center place-content-center">
            <div className="col-span-3">
              <h4 className="text-base font-semibold text-muted-foreground">
                Configure Options
              </h4>
            </div>
            <Label className="text-center">Value</Label>
            <Label className="text-center">Label</Label>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => append(defaultOption)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            {fields.map((field, index) => (
              <React.Fragment key={field.id}>
                <ControlledInput
                  name={`options.${index}.value`}
                  control={form.control}
                  placeholder="Value"
                />
                <ControlledInput
                  name={`options.${index}.label`}
                  control={form.control}
                  placeholder="Label"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </React.Fragment>
            ))}
          </div>
        )}
      </form>
    </Form>
  );
};

export default React.memo(FieldProperties);
