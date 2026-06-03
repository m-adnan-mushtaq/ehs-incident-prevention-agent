import { useFormContext } from "react-hook-form";
import { INPUT_TYPES } from "@/constants/form-builder";
import { FormField as IFormField } from "@/features/governance/types/form-builder";
import ControlledInput from "@/components/form/ControlledInput";

const inputTypeLookup = {
  [INPUT_TYPES.TEXTFIELD]: "text",
  [INPUT_TYPES.EMAIL]: "email",
  [INPUT_TYPES.NUMBER]: "number",
  [INPUT_TYPES.URL]: "url",
  [INPUT_TYPES.PHONE]: "phone",
  [INPUT_TYPES.SLIDER]: "range",
};

const Questionnaire_TextField = ({ formField }: { formField: IFormField }) => {
  const { control } = useFormContext();

  return (
    <ControlledInput
      control={control}
      name={formField.id}
      label={formField.label}
      description={formField.description}
      placeholder={formField.placeholder}
      inputProps={{
        min: formField.min,
        max: formField.max,
        minLength: formField.minLength,
        maxLength: formField.maxLength,
      }}
      type={inputTypeLookup[formField.type as keyof typeof inputTypeLookup]}
      controllerProps={{
        rules: {
          required: formField.required,
          validate: (value) => {
            if (formField.required) {
              if (!value) {
                return "This field is required";
              }
            }
            if (formField.type === INPUT_TYPES.URL) {
              const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
              if (!urlRegex.test(value)) {
                return "Invalid URL";
              }
            }
            if (formField.type === INPUT_TYPES.PHONE) {
              const phoneRegex = /^\+?[1-9]\d{1,14}$/;
              if (!phoneRegex.test(value)) {
                return "Invalid phone number";
              }
            }

            if (formField.type === INPUT_TYPES.EMAIL) {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                return "Invalid email address";
              }
            }
            if (formField.minLength && value?.length < formField.minLength) {
              return `Minimum length is ${formField.minLength}`;
            }
            if (formField.maxLength && value?.length > formField.maxLength) {
              return `Maximum length is ${formField.maxLength}`;
            }
            if (formField.min && value < formField.min) {
              return `Minimum value is ${formField.min}`;
            }
            if (formField.max && value > formField.max) {
              return `Maximum value is ${formField.max}`;
            }
            if (formField.maxSize && value?.length > formField.maxSize) {
              return `Maximum size is ${formField.maxSize} characters`;
            }
            return true;
          },
        },
      }}
    />
  );
};

export default Questionnaire_TextField;
