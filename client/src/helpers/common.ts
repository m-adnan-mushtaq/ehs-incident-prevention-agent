import { AxiosError } from "axios";
import { format } from "date-fns";
import toast from "react-hot-toast";

const capitalize = (str: string): string =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

export const extractDjangoErrorMessages = (
  data: Record<string, unknown>
): string => {
  if (
    Array.isArray(data.non_field_errors) &&
    data.non_field_errors.length > 0
  ) {
    return (data.non_field_errors as string[]).join(" ");
  }
  const messages: string[] = [];

  for (const [field, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      const readableField = field.replace(/_/g, " ");
      messages.push(`${capitalize(readableField)}: ${value.join(" ")}`);
    }
  }
  if (messages.length === 0) {
    return "An unknown error occurred.";
  }

  return messages.join(" ");
};

export const showMutationError = (error: unknown) => {
  let message = "Something went wrong. Please try again.";
  try {
    if (error instanceof Error) {
      message = error.message;
    }
    if (error instanceof AxiosError) {
      const data = error.response?.data;
      if (typeof data === "string") {
        message = data;
      } else if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        if (typeof record.detail === "string") {
          message = record.detail;
        } else if (typeof record.message === "string") {
          message = record.message;
        } else {
          message = extractDjangoErrorMessages(record);
        }
      }
    }
  } catch {
    /* keep default message */
  }

  toast.error(message);
};

export const toTitleCase = (str: string = "") =>
  str
    .replace(/_|-/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );

export const formatDateTime = (str: string | Date) =>
  format(new Date(str), "dd/MM/yyyy hh:mm aa");
