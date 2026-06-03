import { normalizeExtractionData } from "@/features/voice-knowledge/utils/normalizeExtraction";
import { apiRoutes } from "@/constants";
import { unwrapData, type IApiEnvelope } from "@/lib/api";
import type { IVoiceExtractionData } from "@/types/voice-knowledge";
import { apiInstance } from "./_base";

export const extractVoiceKnowledge = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append(
    "file",
    audioBlob,
    `voice-note-${Date.now()}.webm`
  );

  const response = await apiInstance.post<IApiEnvelope<IVoiceExtractionData>>(
    apiRoutes.KNOWLEDGE.extractVoice(),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return normalizeExtractionData(unwrapData(response));
};
