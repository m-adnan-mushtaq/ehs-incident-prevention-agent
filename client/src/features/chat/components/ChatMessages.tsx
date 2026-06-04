import { Skeleton } from "@/components/ui/skeleton";
import type { IChatMessage } from "@/types/chat";
import { useEffect, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatThinkingStatus } from "./ChatThinkingStatus";
import { ChatToolTimeline } from "./ChatToolTimeline";
import type { IChatLiveState } from "../utils/chat-event-reducer";
import { StructuredAssistantResponse } from "./StructuredAssistantResponse";

type Props = {
  messages: IChatMessage[];
  loading?: boolean;
  liveState: IChatLiveState;
  error?: string | null;
  mode?: string;
  socketConnecting?: boolean;
};

export const ChatMessages = ({
  messages,
  loading,
  liveState,
  error,
  mode,
  socketConnecting,
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveState.streamingText, liveState.isStreaming]);

  if (loading) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-4 p-6">
          <Skeleton className="h-16 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="ml-auto h-16 w-1/2" />
        </div>
      </div>
    );
  }

  const streamingId = liveState.activeTurnAssistantMessageId;
  const showLiveAssistant =
    (liveState.isStreaming || liveState.finalResponse) &&
    (liveState.streamingText || liveState.finalResponse);

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/50"
    >
      <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
        {messages.map((msg) => {
          const isLiveAssistant =
            msg.id === streamingId && liveState.isStreaming;
          return (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              streamingText={
                isLiveAssistant ? liveState.streamingText : undefined
              }
              isStreaming={isLiveAssistant}
            />
          );
        })}

        {showLiveAssistant &&
          !messages.some((m) => m.id === streamingId) &&
          liveState.finalResponse &&
          liveState.finalResponse.response_profile === "small_talk" && (
            <ChatMessageBubble
              message={{
                id: liveState.finalResponse.assistant_message_id,
                chat_session_id: liveState.finalResponse.session_id,
                tenant_id: "",
                role: "assistant",
                content:
                  liveState.streamingText || liveState.finalResponse.answer,
                message_type: "text",
                confidence_score: liveState.finalResponse.confidence_score,
                rag_metadata: {
                  response_profile: liveState.finalResponse.response_profile,
                  mode: liveState.finalResponse.mode,
                },
              }}
            />
          )}

        {showLiveAssistant &&
          !messages.some((m) => m.id === streamingId) &&
          liveState.finalResponse &&
          liveState.finalResponse.response_profile !== "small_talk" && (
            <StructuredAssistantResponse
              mode={mode ?? liveState.finalResponse.mode}
              card={liveState.finalResponse.card}
              answer={liveState.streamingText || liveState.finalResponse.answer}
            />
          )}

        {liveState.isStreaming && (
          <div className="max-w-md">
            {liveState.toolEvents.length > 0 ? (
              <ChatToolTimeline items={liveState.toolEvents} mode={mode} />
            ) : (
              <ChatThinkingStatus
                message={liveState.thinkingMessage}
                connecting={socketConnecting}
              />
            )}
          </div>
        )}

        {error && !liveState.isStreaming && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div ref={bottomRef} className="h-px shrink-0" />
      </div>
    </div>
  );
};
