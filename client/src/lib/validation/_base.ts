import { z } from "zod";

export const stringSchema = (label: string, min = 3, max?: number) => {
  let schema = z
    .string()
    .min(min, `${label} must be at least ${min} characters long.`);
  if (typeof max === "number") {
    schema = schema.max(
      max,
      `${label} must be at most ${max} characters long.`
    );
  }
  return schema;
};

export const numberSchema = (label: string, min = 0, max?: number) => {
  let schema = z.coerce.number().min(min, `${label} must be at least ${min}.`);
  if (typeof max === "number") {
    schema = schema.max(max, `${label} must be at most ${max}.`);
  }
  return schema;
};
