import { useFormContext } from "react-hook-form";
import { FormField as IFormField } from "@/features/governance/types/form-builder";
import ControlledTextArea from "@/components/form/ControlledTextArea";

const Questionnaire_TextArea = ({ formField }: { formField: IFormField }) => {
  const { control } = useFormContext();

  return (
    <ControlledTextArea
      control={control}
      name={formField.id}
      label={formField.label}
      description={formField.description}
      placeholder={formField.placeholder}
      controllerProps={{
        rules: {
          required: formField.required,
          validate: (value) => {
            if (formField.minLength && value.length < formField.minLength) {
              return `Minimum length is ${formField.minLength}`;
            }
            if (formField.maxLength && value.length > formField.maxLength) {
              return `Maximum length is ${formField.maxLength}`;
            }
            return true;
          },
        },
      }}
    />
  );
};

export default Questionnaire_TextArea;
