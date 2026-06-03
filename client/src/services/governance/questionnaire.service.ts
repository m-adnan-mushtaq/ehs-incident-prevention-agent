import { FormDefinition } from "@/features/governance/types/form-builder";
import { apiInstance } from "../_base";
import { apiRoutes } from "@/constants";

export enum QuestionnaireStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  STOPPED = "STOPPED",
  SHARED = "SHARED",
}

export enum QuestionnaireScope {
  SECURITY = "SECURITY",
  LEGAL = "LEGAL",
  OTHER = "OTHER",
}

export interface IQuestionnaire {
  pkid: number;
  id: string;
  name: string;
  status: QuestionnaireStatus;
  scope: QuestionnaireScope;
  created_by: number;
  data: FormDefinition;
  created_at: string;
  updated_at: string;
  evidence: string;
}

export const questionnaireStatusOptions = [
  {
    label: "Draft",
    value: QuestionnaireStatus.DRAFT,
  },
  {
    label: "Completed",
    value: QuestionnaireStatus.COMPLETED,
  },
  {
    label: "Stopped",
    value: QuestionnaireStatus.STOPPED,
  },
  {
    label: "Shared",
    value: QuestionnaireStatus.SHARED,
  },
];

export const questionnaireScopeOptions = [
  {
    label: "Security",
    value: QuestionnaireScope.SECURITY,
  },
  {
    label: "Legal",
    value: QuestionnaireScope.LEGAL,
  },
  {
    label: "Other",
    value: QuestionnaireScope.OTHER,
  },
];

export const getAllRecords = () => {
  return apiInstance.get<IQuestionnaire[]>(apiRoutes.QUESTIONNAIRE.getAll());
};

export const getRecordById = (id: string) => {
  return apiInstance.get<IQuestionnaire>(apiRoutes.QUESTIONNAIRE.getById(id));
};

export const createRecord = (formData: FormData) => {
  return apiInstance.post<IQuestionnaire>(
    apiRoutes.QUESTIONNAIRE.createNew(),
    formData
  );
};

export const updateRecordById = ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  return apiInstance.put<IQuestionnaire>(
    apiRoutes.QUESTIONNAIRE.updateById(id),
    formData
  );
};

export const deleteRecordById = (id: string) => {
  return apiInstance.delete(apiRoutes.QUESTIONNAIRE.deleteById(id));
};
