import { useFormContext } from "react-hook-form";
import { FormField as IFormField } from "@/features/governance/types/form-builder";
import ControlledRadioGroup from "@/components/form/ControlledRadioGroup";

const Questionnaire_RadioGroup = ({ formField }: { formField: IFormField }) => {
  const { control } = useFormContext();

  return (
    <ControlledRadioGroup
      control={control}
      name={formField.id}
      options={formField.options || []}
      direction="horizontal"
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

export default Questionnaire_RadioGroup;
