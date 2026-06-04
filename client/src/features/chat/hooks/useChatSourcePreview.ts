import { useDocumentDetail } from "@/features/documents/hooks/useDocumentDetail";
import { useIncidentDetail } from "@/features/incidents/hooks/useIncidentDetail";
import { useVoiceKnowledgeDetail } from "@/features/voice-knowledge/hooks/useVoiceKnowledgeDetail";
import type { ISourceCitation } from "@/types/chat";
import {
  CHAT_SOURCE_TYPE_DOCUMENT,
  CHAT_SOURCE_TYPE_INCIDENT,
  CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT,
  isChatPreviewableSourceType,
} from "../constants/chat-source.constants";

export type ChatSourcePreviewTarget = {
  sourceId: string;
  sourceType: string;
} | null;

export const isPreviewableCitation = (c: ISourceCitation): boolean =>
  Boolean(c.source_id) && isChatPreviewableSourceType(c.source_type);

export const useChatSourcePreview = (target: ChatSourcePreviewTarget) => {
  const sourceId = target?.sourceId ?? null;
  const sourceType = target?.sourceType;

  const documentQuery = useDocumentDetail(
    sourceType === CHAT_SOURCE_TYPE_DOCUMENT ? sourceId : null,
  );
  const incidentQuery = useIncidentDetail(
    sourceType === CHAT_SOURCE_TYPE_INCIDENT ? sourceId : null,
  );
  const knowledgeQuery = useVoiceKnowledgeDetail(
    sourceType === CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT ? sourceId : null,
  );

  const isLoading =
    (sourceType === CHAT_SOURCE_TYPE_DOCUMENT && documentQuery.isLoading) ||
    (sourceType === CHAT_SOURCE_TYPE_INCIDENT && incidentQuery.isLoading) ||
    (sourceType === CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT && knowledgeQuery.isLoading);

  const isError =
    (sourceType === CHAT_SOURCE_TYPE_DOCUMENT && documentQuery.isError) ||
    (sourceType === CHAT_SOURCE_TYPE_INCIDENT && incidentQuery.isError) ||
    (sourceType === CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT && knowledgeQuery.isError);

  return {
    document: documentQuery.data ?? null,
    incident: incidentQuery.data ?? null,
    knowledge: knowledgeQuery.data ?? null,
    isLoading,
    isError,
  };
};
