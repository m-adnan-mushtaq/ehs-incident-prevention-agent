import { INPUT_TYPES_TYPE } from "@/constants/form-builder";

export interface FormField {
  id: string;
  stepId: string;
  type: INPUT_TYPES_TYPE;
  label: string;
  required: boolean;
  options?: {
    label: string;
    value: string;
  }[];
  min?: number;
  max?: number;
  placeholder?: string;
  description?: string;
  minLength?: number;
  maxLength?: number;
  maxSize?: number;
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormDefinition {
  title: string;
  steps: FormStep[];
}
