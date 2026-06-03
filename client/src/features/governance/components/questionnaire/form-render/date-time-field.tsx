import { useFormContext } from "react-hook-form";
import { FormField as IFormField } from "@/features/governance/types/form-builder";
import ControlledDateTimeInput from "@/components/form/ControlledDateTimeinput";

const Questionnaire_DateTimePicker = ({
  formField,
}: {
  formField: IFormField;
}) => {
  const { control } = useFormContext();

  return (
    <ControlledDateTimeInput
      label={formField.label}
      description={formField.description}
      placeholder={formField.placeholder}
      control={control}
      name={formField.id}
      controllerProps={{
        rules: {
          required: formField.required,
        },
      }}
    />
  );
};

export default Questionnaire_DateTimePicker;
