import {
  Type,
  Mail,
  Hash,
  CheckSquare,
  List,
  Sliders,
  Calendar,
  Link,
  Phone,
  AlignLeft,
  ListFilter,
  Clock,
  ListChecks,
  FileUp,
} from "lucide-react";

export const INPUT_TYPES = {
  TEXTFIELD: "TEXTFIELD",
  EMAIL: "EMAIL",
  NUMBER: "NUMBER",
  CHECKBOX: "CHECKBOX",
  SELECT: "SELECT",
  SLIDER: "SLIDER",
  DATEPICKER: "DATEPICKER",
  URL: "URL",
  PHONE: "PHONE",
  TEXTAREA: "TEXTAREA",
  RADIOGROUP: "RADIOGROUP",
  DATETIME_PICKER: "DATETIME_PICKER",
  MULTI_SELECT: "MULTI_SELECT",
  FILE_UPLOAD: "FILE_UPLOAD",
} as const;

export type INPUT_TYPES_TYPE = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES];

export const inputTypeOptions = {
  simpleResponses: [
    {
      Icon: Type,
      label: "Text Field",
      value: INPUT_TYPES.TEXTFIELD,
    },
    {
      Icon: Mail,
      label: "Email",
      value: INPUT_TYPES.EMAIL,
    },
    {
      Icon: Hash,
      label: "Number",
      value: INPUT_TYPES.NUMBER,
    },
    {
      Icon: Phone,
      label: "Phone",
      value: INPUT_TYPES.PHONE,
    },
    {
      Icon: Link,
      label: "URL",
      value: INPUT_TYPES.URL,
    },
    {
      Icon: AlignLeft,
      label: "Text Area",
      value: INPUT_TYPES.TEXTAREA,
    },
  ],
  advancedResponses: [
    {
      Icon: CheckSquare,
      label: "Checkbox",
      value: INPUT_TYPES.CHECKBOX,
    },
    {
      Icon: List,
      label: "Select",
      value: INPUT_TYPES.SELECT,
    },
    {
      Icon: ListChecks,
      label: "Multi Select",
      value: INPUT_TYPES.MULTI_SELECT,
    },
    {
      Icon: ListFilter,
      label: "Radio Group",
      value: INPUT_TYPES.RADIOGROUP,
    },
    {
      Icon: Sliders,
      label: "Slider",
      value: INPUT_TYPES.SLIDER,
    },
    {
      Icon: Calendar,
      label: "Date Picker",
      value: INPUT_TYPES.DATEPICKER,
    },
    {
      Icon: Clock,
      label: "Date Time Picker",
      value: INPUT_TYPES.DATETIME_PICKER,
    },
  ],
  fileUploads: [
    {
      Icon: FileUp,
      label: "File Upload",
      value: INPUT_TYPES.FILE_UPLOAD,
    },
  ],
};

export const formTypeIconColors = {
  [INPUT_TYPES.TEXTFIELD]: "text-blue-500",
  [INPUT_TYPES.EMAIL]: "text-green-500",
  [INPUT_TYPES.NUMBER]: "text-purple-500",
  [INPUT_TYPES.PHONE]: "text-orange-500",
  [INPUT_TYPES.URL]: "text-cyan-500",
  [INPUT_TYPES.TEXTAREA]: "text-emerald-500",
  [INPUT_TYPES.CHECKBOX]: "text-indigo-500",
  [INPUT_TYPES.SELECT]: "text-amber-500",
  [INPUT_TYPES.MULTI_SELECT]: "text-violet-500",
  [INPUT_TYPES.RADIOGROUP]: "text-pink-500",
  [INPUT_TYPES.SLIDER]: "text-teal-500",
  [INPUT_TYPES.DATEPICKER]: "text-lime-500",
  [INPUT_TYPES.FILE_UPLOAD]: "text-sky-500",
  [INPUT_TYPES.DATETIME_PICKER]: "text-fuchsia-500",
};
