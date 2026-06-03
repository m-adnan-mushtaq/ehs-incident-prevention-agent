export type KnowledgeStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "archived"
  | "superseded";

export type KnowledgeRiskLevel = "low" | "medium" | "high" | "critical" | string;

export interface IKnowledgeObject {
  id: string;
  site_ids?: string[] | null;
  source_type: string;
  source_id?: string | null;
  title: string;
  topic?: string | null;
  task_type?: string | null;
  asset_name?: string | null;
  risk_level?: KnowledgeRiskLevel | null;
  problem?: string | null;
  root_cause?: string | null;
  recommended_action?: string | null;
  lesson_learned?: string | null;
  safety_warning?: string | null;
  required_ppe?: string[] | null;
  stop_work_triggers?: string[] | null;
  status: KnowledgeStatus | string;
  confidence_score?: number | string | null;
  sme_notes?: string | null;
  rejection_reason?: string | null;
  created_by?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ICreateKnowledgeObjectPayload {
  source_type: string;
  source_id?: string;
  title: string;
  site_ids?: string[];
  topic?: string;
  task_type?: string;
  asset_name?: string;
  risk_level?: string;
  problem?: string;
  root_cause?: string;
  recommended_action?: string;
  lesson_learned?: string;
  safety_warning?: string;
  required_ppe?: string[];
  stop_work_triggers?: string[];
  confidence_score?: number;
  sme_notes?: string;
  status: KnowledgeStatus;
}

export type IUpdateKnowledgeObjectPayload = Partial<ICreateKnowledgeObjectPayload> & {
  rejection_reason?: string;
};
