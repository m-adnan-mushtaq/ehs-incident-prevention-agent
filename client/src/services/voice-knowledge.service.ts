import { apiRoutes } from "@/constants";
import { unwrapData, type IApiEnvelope } from "@/lib/api";
import type { IVoiceExtractionData } from "@/types/voice-knowledge";
import { apiInstance } from "./_base";

export const extractVoiceKnowledge = async (audioBlob: Blob) => {
  const formData = new FormData();
  const ext = audioBlob.type.includes("webm") ? "webm" : "audio";
  formData.append(
    "file",
    audioBlob,
    `voice-note-${Date.now()}.${ext === "webm" ? "webm" : "webm"}`
  );

  const response = await apiInstance.post<IApiEnvelope<IVoiceExtractionData>>(
    apiRoutes.KNOWLEDGE.extractVoice(),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return unwrapData(response);
};
