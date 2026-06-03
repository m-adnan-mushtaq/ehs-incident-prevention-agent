import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IChatSession } from "@/types/chat";
import { Plus } from "lucide-react";
import { formatChatTimestamp } from "../utils/chat-formatters";

type Props = {
  sessions: IChatSession[];
  loading?: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  modeLabel?: string;
};

export const ChatSessionList = ({
  sessions,
  loading,
  activeId,
  onSelect,
  onNewChat,
  modeLabel,
}: Props) => (
  <div className="flex min-h-0 flex-1 flex-col bg-white">
    <div className="shrink-0 space-y-2 border-b border-slate-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-900">
          {modeLabel ? `${modeLabel} chats` : "Recent chats"}
        </p>
      </div>
      <Button className="w-full" onClick={onNewChat}>
        <Plus className="h-4 w-4" />
        New chat
      </Button>
    </div>
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-1 p-2">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        {!loading && sessions.length === 0 && (
          <p className="px-2 py-6 text-center text-xs leading-relaxed text-slate-500">
            No chats in this mode yet. Start a new conversation above.
          </p>
        )}
        {sessions.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={cn(
              "w-full rounded-md px-3 py-2.5 text-left transition",
              activeId === s.id
                ? "bg-blue-50 text-blue-900 ring-1 ring-blue-200"
                : "text-slate-700 hover:bg-slate-50"
            )}
          >
            <p className="truncate text-sm font-medium">
              {s.title || "Safety chat"}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              {formatChatTimestamp(s.updated_at ?? s.created_at)}
            </p>
          </button>
        ))}
      </div>
    </ScrollArea>
  </div>
);
