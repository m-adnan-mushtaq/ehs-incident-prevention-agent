import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { IChatSession } from "@/types/chat";
import { History, Shield } from "lucide-react";
import { formatChatMode } from "../utils/chat-formatters";
import { ChatSessionList } from "./ChatSessionList";

type Props = {
  session: IChatSession | null;
  sessions: IChatSession[];
  sessionsLoading: boolean;
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  socketConnected: boolean;
};

export const ChatHeader = ({
  session,
  sessions,
  sessionsLoading,
  activeSessionId,
  onSelectSession,
  onNewChat,
  socketConnected,
}: Props) => (
  <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <Shield className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold text-slate-900">
          {session?.title || "Safety Assistant"}
        </h1>
        <p className="truncate text-xs text-slate-500">
          {formatChatMode(session?.mode)}
          {!socketConnected && activeSessionId && " · Connecting…"}
        </p>
      </div>
      {session?.status && (
        <Badge variant="outline" className="hidden border-slate-200 sm:inline-flex">
          {session.status}
        </Badge>
      )}
    </div>
    <div className="flex items-center gap-2 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="border-slate-200"
            aria-label="Open chat history"
          >
            <History className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(100%,20rem)] bg-white p-0">
          <ChatSessionList
            sessions={sessions}
            loading={sessionsLoading}
            activeId={activeSessionId}
            onSelect={onSelectSession}
            onNewChat={onNewChat}
          />
        </SheetContent>
      </Sheet>
    </div>
  </header>
);
