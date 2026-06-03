import { useFormContext } from "react-hook-form";
import { FormField as IFormField } from "@/features/governance/types/form-builder";
import ControlledFileInput from "@/components/form/ControlledFileInput";

const default_10mb = 10 * 1024 * 1024 * 1024;
const Questionnaire_FileInput = ({ formField }: { formField: IFormField }) => {
  const { control } = useFormContext();

  return (
    <ControlledFileInput
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
      maxSize={formField.maxSize ? formField.maxSize * 1024 : default_10mb}
    />
  );
};

export default Questionnaire_FileInput;
