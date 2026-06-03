import Container from "@/components/layout/container";
import StepsWizard from "@/components/shared/step-wizard";
import { Button } from "@/components/ui/button";
import {
  IQuestionnaireSchema,
  questionnaireSchema,
} from "@/lib/validation/questionnaire.validation";
import { useFormBuilderStore } from "@/store/form-builder";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, FileText, Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import FormBuilder from "./form-builder";
import { Form } from "@/components/ui/form";
import { showMutationError } from "@/helpers/common";
import QuestionnairePropertiesForm from "./questionnaire-steps";
import toast from "react-hot-toast";

type Props = {
  defaultValues?: IQuestionnaireSchema;
  type?: "add" | "update";
  handleSubmit: (data: FormData) => Promise<void>;
};

const steps = [
  {
    label: "Build Questionnaire",
    Icon: FileText,
  },
  {
    label: "Configure Questionnaire",
    Icon: Settings,
  },
];

const QuestionnaireForm = ({
  defaultValues,
  type = "add",
  handleSubmit: saveChanges,
}: Props) => {
  const navigate = useNavigate();
  const resetFormJson = useFormBuilderStore((store) => store.resetFormJson);
  const [step, setStep] = useState<number>(0);

  const form = useForm<IQuestionnaireSchema>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const handleBack = () => {
    resetFormJson();
    navigate(-1);
  };
  const handleSubmit = async (data: IQuestionnaireSchema) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "evidence") {
          const file = value[0] as File;
          formData.append(key, file);
        } else {
          if (typeof value === "object") {
            value = JSON.stringify(value);
          }
          formData.append(key, value);
        }
      });
      await saveChanges(formData);
      handleBack();
      toast.success("Questionnaire saved successfully");
    } catch (error) {
      showMutationError(error);
    }
  };

  const handleNextStep = () => {
    const formJson = useFormBuilderStore.getState().formJson;
    form.setValue("data", formJson);
    form.setValue("name", formJson.title);
    setStep(step + 1);
  };

  return (
    <Container>
      <div className="flex items-center gap-2 ">
        <Button variant={"ghost"} onClick={handleBack}>
          <ChevronLeft /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-medium text-foreground">
            {type === "add" ? "Create" : "Update"} Questionnaire
          </h1>
        </div>
      </div>
      <div className="px-4 md:px-6">
        <StepsWizard step={step} steps={steps} totalSteps={steps.length} />
      </div>

      {step === 0 && <FormBuilder />}
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
          {step === 1 && <QuestionnairePropertiesForm />}
          <div className="flex items-center justify-between gap-2">
            {step > 0 ? (
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setStep(step - 1)}
              >
                <ChevronLeft /> Back
              </Button>
            ) : (
              <div></div>
            )}
            {step === 0 && (
              <Button
                type={"button"} // Only submit on step 1
                onClick={handleNextStep}
              >
                Next
              </Button>
            )}
            {step === 1 && (
              <Button
                disabled={form.formState.isSubmitting}
                type={"submit"} // Only submit on step 1
              >
                Save Questionnaire
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Container>
  );
};

export default QuestionnaireForm;
