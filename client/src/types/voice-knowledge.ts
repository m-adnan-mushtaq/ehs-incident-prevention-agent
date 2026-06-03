import type { KnowledgeRiskLevel } from "./knowledge-object";

export interface IVoiceExtractionData {
  title?: string;
  topic?: string;
  task_type?: string;
  asset_name?: string;
  risk_level?: KnowledgeRiskLevel;
  problem?: string;
  root_cause?: string;
  recommended_action?: string;
  lesson_learned?: string;
  safety_warning?: string;
  required_ppe?: string[];
  stop_work_triggers?: string[];
  confidence_score?: number;
  raw_transcript?: string;
  raw_model_output?: string;
}

export interface IVoiceKnowledgeFormValues {
  title: string;
  topic?: string;
  task_type?: string;
  asset_name?: string;
  risk_level?: string;
  problem?: string;
  root_cause?: string;
  recommended_action?: string;
  lesson_learned?: string;
  safety_warning?: string;
  required_ppe: string[];
  stop_work_triggers: string[];
  sme_notes?: string;
  site_id?: string;
}
