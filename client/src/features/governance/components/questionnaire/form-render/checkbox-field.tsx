import { useFormContext } from "react-hook-form";
import { FormField as IFormField } from "@/features/governance/types/form-builder";
import ControlledCheckbox from "@/components/form/ControlledCheckbox";

const Questionnaire_Checkbox = ({ formField }: { formField: IFormField }) => {
  const { control } = useFormContext();

  return (
    <ControlledCheckbox
      control={control}
      name={formField.id}
      label={formField.label}
      description={formField.description}
      controllerProps={{
        rules: {
          required: formField.required,
        },
      }}
    />
  );
};

export default Questionnaire_Checkbox;
