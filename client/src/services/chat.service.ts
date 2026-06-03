import { apiRoutes } from "@/constants";
import { unwrapData, type IApiEnvelope } from "@/lib/api";
import type {
  IChatFinalResponse,
  IChatMessage,
  IChatSession,
  ICreateChatSessionPayload,
  ISendChatMessagePayload,
} from "@/types/chat";
import { apiInstance } from "./_base";

export const createChatSession = async (payload: ICreateChatSessionPayload) => {
  const response = await apiInstance.post<IApiEnvelope<IChatSession>>(
    apiRoutes.CHAT.sessions(),
    payload
  );
  return unwrapData(response);
};

export const getChatSessions = async (): Promise<IChatSession[]> => {
  const response = await apiInstance.get<IApiEnvelope<IChatSession[]>>(
    apiRoutes.CHAT.sessions()
  );
  return unwrapData(response);
};

export const getChatSessionById = async (
  sessionId: string
): Promise<IChatSession | null> => {
  const sessions = await getChatSessions();
  return sessions.find((s) => s.id === sessionId) ?? null;
};

export const getChatMessages = async (
  sessionId: string
): Promise<IChatMessage[]> => {
  const response = await apiInstance.get<IApiEnvelope<IChatMessage[]>>(
    apiRoutes.CHAT.messages(sessionId)
  );
  return unwrapData(response);
};

export const sendChatMessage = async (
  sessionId: string,
  payload: ISendChatMessagePayload
): Promise<IChatFinalResponse> => {
  const formData = new FormData();
  if (payload.message?.trim()) formData.append("message", payload.message.trim());
  if (payload.image) formData.append("image", payload.image);

  const response = await apiInstance.post<IApiEnvelope<IChatFinalResponse>>(
    apiRoutes.CHAT.messages(sessionId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return unwrapData(response);
};

export const deleteChatSession = async (sessionId: string) => {
  const response = await apiInstance.delete<IApiEnvelope<{ message: string }>>(
    apiRoutes.CHAT.sessionById(sessionId)
  );
  return unwrapData(response);
};
