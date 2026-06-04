import { cn } from "@/lib/utils";
import { getChatImageUrl } from "@/helpers/media";
import type { IChatMessage, ISourceCitation } from "@/types/chat";
import {
  buildCardFromMetadata,
  formatChatTimestamp,
} from "../utils/chat-formatters";
import { ChatMarkdownPreview } from "./ChatMarkdownPreview";
import { StructuredAssistantResponse } from "./StructuredAssistantResponse";

type Props = {
  message: IChatMessage;
  streamingText?: string;
  isStreaming?: boolean;
};

export const ChatMessageBubble = ({
  message,
  streamingText,
  isStreaming,
}: Props) => {
  const isUser = message.role === "user";
  const meta = message.rag_metadata ?? {};
  const mode = (meta.mode as string) ?? undefined;
  const responseProfile = (meta.response_profile as string) ?? undefined;
  const chatImageUrl = isUser ? getChatImageUrl(message.image_key) : null;

  const resolvedCard = !isUser
    ? buildCardFromMetadata(
        meta.card as Record<string, unknown> | undefined,
        meta.citations as ISourceCitation[] | undefined,
        message.confidence_score,
        message.content,
      )
    : null;

  const showStructured =
    resolvedCard !== null && responseProfile !== "small_talk";

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[min(100%,42rem)]",
          isUser ? "max-w-[85%]" : "w-full"
        )}
      >
        {isUser ? (
          <div className="rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white shadow-sm">
            {chatImageUrl && (
              <img
                src={chatImageUrl}
                alt={message.image_file_name || "Uploaded safety image"}
                className="mb-3 max-h-80 w-full rounded-lg object-contain"
                loading="lazy"
              />
            )}
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>
          </div>
        ) : showStructured ? (
          <StructuredAssistantResponse
            mode={mode}
            card={resolvedCard}
            answer={streamingText || message.content}
          />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <ChatMarkdownPreview
              source={streamingText || message.content}
              className="text-sm leading-relaxed text-slate-800"
            />
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-slate-400" />
            )}
          </div>
        )}
        {message.created_at && (
          <p
            className={cn(
              "mt-1 text-[10px] text-slate-400",
              isUser && "text-right"
            )}
          >
            {formatChatTimestamp(message.created_at)}
          </p>
        )}
      </div>
    </div>
  );
};
