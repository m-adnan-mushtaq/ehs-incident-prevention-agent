import type { IChatSession, TChatMode } from "@/types/chat";
import { useMemo } from "react";
import { CHAT_MODE_LABELS } from "../utils/chat.constants";
import { ChatModeTabs } from "./ChatModeTabs";
import { ChatSessionList } from "./ChatSessionList";

type Props = {
  sessions: IChatSession[];
  sessionsLoading: boolean;
  activeSessionId: string | null;
  selectedMode: TChatMode;
  onModeChange: (mode: TChatMode) => void;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
};

export const ChatSidebar = ({
  sessions,
  sessionsLoading,
  activeSessionId,
  selectedMode,
  onModeChange,
  onSelectSession,
  onNewChat,
}: Props) => {
  const modeSessions = useMemo(
    () => sessions.filter((s) => s.mode === selectedMode),
    [sessions, selectedMode]
  );

  return (
    <aside className="hidden h-full min-h-0 w-80 shrink-0 flex-col border-r border-slate-200 bg-slate-50/50 lg:flex">
      <div className="shrink-0 border-b border-slate-200 bg-white">
        <div className="px-3 pt-3">
          <p className="text-xs font-semibold text-slate-900">Assistant mode</p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Pick how the assistant should respond. History below is filtered to
            this mode.
          </p>
        </div>
        <ChatModeTabs value={selectedMode} onChange={onModeChange} />
      </div>
      <ChatSessionList
        sessions={modeSessions}
        loading={sessionsLoading}
        activeId={activeSessionId}
        onSelect={onSelectSession}
        onNewChat={onNewChat}
        modeLabel={CHAT_MODE_LABELS[selectedMode]}
      />
    </aside>
  );
};
