import { useFormContext } from "react-hook-form";
import { FormField as IFormField } from "@/features/governance/types/form-builder";
import ControlledDateInput from "@/components/form/ControlledDateInput";

const Questionnaire_DatePicker = ({ formField }: { formField: IFormField }) => {
  const { control } = useFormContext();

  return (
    <ControlledDateInput
      control={control}
      name={formField.id}
      label={formField.label}
      description={formField.description}
      placeholder={formField.placeholder}
      controllerProps={{
        rules: {
          required: formField.required,
        },
      }}
    />
  );
};

export default Questionnaire_DatePicker;
