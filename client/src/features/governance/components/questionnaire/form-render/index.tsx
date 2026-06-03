import { INPUT_TYPES } from "@/constants/form-builder";
import { useForm } from "react-hook-form";
import Questionnaire_TextField from "./text-field";
import Questionnaire_Select from "./select-field";
import Questionnaire_MultiSelect from "./multi-select-field";
import Questionnaire_FileInput from "./file-input";
import Questionnaire_TextArea from "./text-area";
import Questionnaire_RadioGroup from "./radio-group";
import Questionnaire_DatePicker from "./date-fied";
import Questionnaire_DateTimePicker from "./date-time-field";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import React, { useMemo, useState } from "react";
import { showMutationError } from "@/helpers/common";
import MultiStepFormHeader from "./form-header";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import {
  FormDefinition,
  FormField,
} from "@/features/governance/types/form-builder";
import Questionnaire_Checkbox from "./checkbox-field";
import toast from "react-hot-toast";

type FormRenderProps = {
  formJson: FormDefinition;
  defaultValues?: GenericObject;
  handleSubmit?: (data: GenericObject) => void;
};

const renderField = (field: FormField) => {
  switch (field.type) {
    case INPUT_TYPES.TEXTFIELD:
    case INPUT_TYPES.NUMBER:
    case INPUT_TYPES.URL:
    case INPUT_TYPES.SLIDER:
    case INPUT_TYPES.EMAIL:
    case INPUT_TYPES.PHONE:
      return <Questionnaire_TextField formField={field} />;
    case INPUT_TYPES.CHECKBOX:
      return <Questionnaire_Checkbox formField={field} />;
    case INPUT_TYPES.SELECT:
      return <Questionnaire_Select formField={field} />;
    case INPUT_TYPES.MULTI_SELECT:
      return <Questionnaire_MultiSelect formField={field} />;
    case INPUT_TYPES.FILE_UPLOAD:
      return <Questionnaire_FileInput formField={field} />;
    case INPUT_TYPES.TEXTAREA:
      return <Questionnaire_TextArea formField={field} />;
    case INPUT_TYPES.RADIOGROUP:
      return <Questionnaire_RadioGroup formField={field} />;
    case INPUT_TYPES.DATEPICKER:
      return <Questionnaire_DatePicker formField={field} />;
    case INPUT_TYPES.DATETIME_PICKER:
      return <Questionnaire_DateTimePicker formField={field} />;
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};

const Questionnaire_FormRender = ({
  formJson,
  defaultValues = {},
  handleSubmit: handleSubmitForm,
}: FormRenderProps) => {
  const form = useForm({
    defaultValues,
  });
  const { modalState, modalStateHandler } = useModal();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { isLastStep, currentStepFields } = useMemo(() => {
    const currentStep$ = formJson.steps[currentStepIndex];
    const isLastStep = currentStepIndex === formJson.steps.length - 1;
    const currentStepFields = currentStep$.fields;
    return {
      isLastStep,
      currentStepFields,
    };
  }, [currentStepIndex]);

  const handleNextStep = async () => {
    const fieldsKey = currentStepFields.map((field) => field.id);
    const isValid = await form.trigger(fieldsKey);
    if (isValid) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      toast.error("Please enter valid input");
    }
  };

  const handleSubmit = (data: GenericObject) => {
    try {
      if (!handleSubmitForm) return;
      console.log("data =>", data);
    } catch (error) {
      showMutationError(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className="mt-4"
          noValidate
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="space-y-4 p-4 bg-background">
            <MultiStepFormHeader
              title={formJson.title}
              currentStep={currentStepIndex + 1}
              totalSteps={formJson.steps.length}
              steps={formJson.steps.map((step) => step.title)}
              showStepIndicators
            />
            {currentStepFields?.map((field) => {
              return (
                <React.Fragment key={field.id}>
                  {renderField(field)}
                </React.Fragment>
              );
            })}

            <div className="flex items-center justify-between p-4">
              {currentStepIndex > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                >
                  <ChevronLeft /> Previous
                </Button>
              ) : (
                <div></div>
              )}
              <Button
                onClick={async (e) => {
                  if (!isLastStep) {
                    e.preventDefault();
                    handleNextStep();
                    return;
                  }
                }}
                type={isLastStep ? "submit" : "button"}
              >
                {isLastStep ? "Submit" : "Next"} <ChevronRight />
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <ConfirmationDialog
        open={modalState.delete}
        handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
        title="Submission Confirmation?"
        description="Please review your submission before proceeding. Once submitted, you will not be able to edit the form."
        deleteBtnText="Confirm"
        deleteVariant="default"
        handleDelete={() => {
          modalStateHandler(MODAL_TYPE.DELETE, false);
        }}
      />
    </>
  );
};

export default Questionnaire_FormRender;
