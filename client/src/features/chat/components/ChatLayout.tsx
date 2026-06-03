import { CACHE_KEYS } from "@/constants/common";
import { sitesService } from "@/services";
import type { TChatMode } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { placeholderForMode } from "../utils/chat-formatters";
import { CHAT_ERROR_MESSAGE } from "../utils/chat.constants";
import { useActiveChat } from "../hooks/useActiveChat";
import { useChatMessageFlow } from "../hooks/useChatMessageFlow";
import { useChatMessages } from "../hooks/useChatMessages";
import { useChatSocket } from "../hooks/useChatSocket";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ChatSidebar } from "./ChatSidebar";
import { NewChatDialog } from "./NewChatDialog";

const ChatLayout = () => {
  const {
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
  } = useActiveChat();

  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [composeMode, setComposeMode] = useState<TChatMode>("incident_prevention");

  const mode = (activeSession?.mode ?? composeMode) as TChatMode;
  const { data: apiMessages = [], isLoading: messagesLoading } =
    useChatMessages(sessionId);

  const { data: sites = [] } = useQuery({
    queryKey: CACHE_KEYS.sites.listAll,
    queryFn: sitesService.getAllSites,
  });

  const { connected, liveState, dispatchLive } = useChatSocket(sessionId);

  const flow = useChatMessageFlow({
    sessionId,
    composeMode,
    selectedSiteId,
    openSession,
    apiMessages,
    liveState,
    dispatchLive,
  });

  useEffect(() => {
    dispatchLive({ type: "reset" });
  }, [sessionId, dispatchLive]);

  useEffect(() => {
    if (liveState.error) {
      flow.setInlineError(CHAT_ERROR_MESSAGE);
    }
  }, [liveState.error, flow]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageSelect = (file: File | null) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSend = () => {
    const text = input;
    const img = imageFile;
    setInput("");
    handleImageSelect(null);
    void flow.handleSend(text, img, (restoredText, restoredImage) => {
      setInput(restoredText);
      if (restoredImage) handleImageSelect(restoredImage);
    });
  };

  const confirmNewChat = (chatMode: TChatMode, siteId: string | null) => {
    setComposeMode(chatMode);
    setSelectedSiteId(siteId);
    setNewDialogOpen(false);
    openNewChat();
    flow.setLocalMessages([]);
    setInput("");
    handleImageSelect(null);
  };

  const showEmpty = !sessionId && flow.localMessages.length === 0;

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-slate-50">
      <ChatSidebar
        sessions={sessions}
        sessionsLoading={sessionsLoading}
        activeSessionId={sessionId}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        onSelectSession={openSession}
        onNewChat={() => setNewDialogOpen(true)}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <ChatHeader
          session={activeSession}
          sessions={sessions}
          sessionsLoading={sessionsLoading}
          activeSessionId={sessionId}
          onSelectSession={openSession}
          onNewChat={() => setNewDialogOpen(true)}
          socketConnected={connected}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {showEmpty ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ChatEmptyState onSelectPrompt={setInput} mode={mode} />
            </div>
          ) : (
            <ChatMessages
              messages={flow.localMessages}
              loading={Boolean(sessionId) && messagesLoading}
              liveState={liveState}
              error={flow.inlineError}
              mode={mode}
              socketConnecting={!connected && Boolean(sessionId)}
            />
          )}
        </div>
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          placeholder={placeholderForMode(mode)}
          disabled={flow.sending || flow.creating}
          sending={flow.sending}
          imageFile={imageFile}
          imagePreview={imagePreview}
          onImageSelect={handleImageSelect}
        />
      </div>
      <NewChatDialog
        open={newDialogOpen}
        initialMode={composeMode}
        sites={sites}
        loading={flow.creating}
        onClose={() => setNewDialogOpen(false)}
        onConfirm={confirmNewChat}
      />
    </div>
  );
};

export default ChatLayout;
