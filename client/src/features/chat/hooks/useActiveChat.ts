import { ROUTE_PATHS } from "@/routes/paths";
import type { TChatMode } from "@/types/chat";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useChatSessions } from "./useChatSessions";

export const useActiveChat = () => {
  const params = useParams({ strict: false }) as { sessionId?: string };
  const sessionId = params.sessionId ?? null;
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<TChatMode>("incident_prevention");
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const { data: sessions = [], isLoading: sessionsLoading } = useChatSessions();

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === sessionId) ?? null,
    [sessions, sessionId]
  );

  const openSession = useCallback(
    (id: string) => {
      navigate({ to: ROUTE_PATHS.app.chatSession, params: { sessionId: id } });
    },
    [navigate]
  );

  const openNewChat = useCallback(() => {
    navigate({ to: ROUTE_PATHS.app.chat });
  }, [navigate]);

  return {
    sessionId,
    activeSession,
    sessions,
    sessionsLoading,
    selectedMode,
    setSelectedMode,
    selectedSiteId,
    setSelectedSiteId,
    openSession,
    openNewChat,
  };
};
