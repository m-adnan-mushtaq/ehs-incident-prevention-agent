import { z } from "zod";
import { stringSchema } from "./_base";
import {
  QuestionnaireScope,
  QuestionnaireStatus,
} from "@/services/governance/questionnaire.service";

export const questionnaireSchema = z.object({
  name: stringSchema("name", 3, 50),
  status: z.nativeEnum(QuestionnaireStatus),
  scope: z.nativeEnum(QuestionnaireScope),
  evidence: z.array(z.any()).nonempty("Evidence is required"),
  data: z.record(z.any()), // Accepts any key-value JSON object
});

export type IQuestionnaireSchema = z.infer<typeof questionnaireSchema>;
