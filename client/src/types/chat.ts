export type TChatMode = "normal_chat" | "incident_prevention" | "image_check";

export interface IChatSession {
  id: string;
  tenant_id: string;
  site_id?: string | null;
  user_id: string;
  mode: TChatMode | string;
  title?: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface IChatMessage {
  id: string;
  chat_session_id: string;
  tenant_id: string;
  site_id?: string | null;
  user_id?: string | null;
  role: "user" | "assistant" | "system" | string;
  content: string;
  message_type: string;
  confidence_score?: number | null;
  rag_metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateChatSessionPayload {
  mode: TChatMode;
  site_id?: string | null;
  title?: string;
}

export interface ISendChatMessagePayload {
  message?: string;
  image?: File | null;
}

export interface ISourceCitation {
  id?: string;
  lane?: string;
  source_type: string;
  source_id?: string;
  chunk_id?: string;
  title?: string | null;
  document_title?: string | null;
  section_title?: string | null;
  page_number?: number | null;
  relevance_score?: number | null;
  confidence_score?: number | null;
}

export interface ISafetyAnswerCard {
  answer: string;
  risk_level?: string | null;
  must_verify?: string[];
  required_ppe?: string[];
  stop_work_triggers?: string[];
  common_mistakes?: string[];
  similar_incidents?: string[];
  citations?: ISourceCitation[];
  confidence_score?: number;
  task?: string;
  note?: string;
  steps?: string[];
  warnings?: string[];
}

export interface IIncidentPreventionBrief extends ISafetyAnswerCard {}

export interface IImageSafetyCheckCard extends ISafetyAnswerCard {
  image_safety_summary?: string;
  observed_hazards?: string[];
  recommended_checks?: string[];
  limitations?: string[];
}

export interface IKnowledgeCard extends ISafetyAnswerCard {
  summary?: string;
}

export interface IChatFinalResponse {
  session_id: string;
  user_message_id: string;
  assistant_message_id: string;
  mode: string;
  answer: string;
  card: Record<string, unknown>;
  citations: ISourceCitation[];
  confidence_score: number;
  rag_metadata?: Record<string, unknown>;
}

export interface IChatSocketPayload {
  session_id: string;
  message_id?: string;
  user_message_id?: string;
  assistant_message_id?: string | null;
  status?: string;
  event?: string;
  data?: unknown;
  error?: string;
}
