import { useFormContext } from "react-hook-form";
import { FormField as IFormField } from "@/features/governance/types/form-builder";
import ControlledSelect from "@/components/form/ControlledSelect";

const Questionnaire_Select = ({ formField }: { formField: IFormField }) => {
  const { control } = useFormContext();

  return (
    <ControlledSelect
      control={control}
      name={formField.id}
      label={formField.label}
      description={formField.description}
      placeholder={formField.placeholder}
      options={formField.options || []}
      controllerProps={{
        rules: {
          required: formField.required,
        },
      }}
    />
  );
};

export default Questionnaire_Select;
