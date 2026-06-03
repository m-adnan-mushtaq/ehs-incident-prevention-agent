import { useFormContext } from "react-hook-form";
import { FormField as IFormField } from "@/features/governance/types/form-builder";
import ControlledMultiSelect from "@/components/form/ControlledMultiSelect";

const Questionnaire_MultiSelect = ({
  formField,
}: {
  formField: IFormField;
}) => {
  const { control } = useFormContext();

  return (
    <ControlledMultiSelect
      control={control}
      name={formField.id}
      options={formField.options || []}
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

export default Questionnaire_MultiSelect;
