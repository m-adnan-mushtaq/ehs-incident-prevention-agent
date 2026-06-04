import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentDetailModal } from "@/features/documents/components/DocumentDetailModal";
import { IncidentDetailModal } from "@/features/incidents/components/IncidentDetailModal";
import { VoiceKnowledgeDetailModal } from "@/features/voice-knowledge/components/VoiceKnowledgeDetailModal";
import { CACHE_KEYS } from "@/constants/common";
import { sitesService } from "@/services";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import {
  CHAT_SOURCE_TYPE_DOCUMENT,
  CHAT_SOURCE_TYPE_INCIDENT,
  CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT,
} from "../constants/chat-source.constants";
import {
  useChatSourcePreview,
  type ChatSourcePreviewTarget,
} from "../hooks/useChatSourcePreview";
import { ChatSourcePreviewSkeleton } from "./ChatSourcePreviewSkeleton";

type Props = {
  target: ChatSourcePreviewTarget;
  onClose: () => void;
};

export const ChatSourcePreviewModals = ({ target, onClose }: Props) => {
  const open = Boolean(target);
  const user = useAuthStore((s) => s.user);
  const { document, incident, knowledge, isLoading, isError } =
    useChatSourcePreview(target);

  const { data: sites = [] } = useQuery({
    queryKey: CACHE_KEYS.sites.listAll,
    queryFn: sitesService.getAllSites,
    enabled:
      open && target?.sourceType === CHAT_SOURCE_TYPE_INCIDENT,
  });

  if (!open || !target) return null;

  if (isLoading) {
    return (
      <ChatSourcePreviewSkeleton
        open
        sourceType={target.sourceType}
        onClose={onClose}
      />
    );
  }

  if (isError) {
    return (
      <Dialog open onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-md border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-950">Source unavailable</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            This source could not be loaded. It may have been removed or you may not
            have access.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  if (target.sourceType === CHAT_SOURCE_TYPE_DOCUMENT) {
    return (
      <DocumentDetailModal
        open
        document={document}
        isLoading={false}
        onClose={onClose}
      />
    );
  }

  if (target.sourceType === CHAT_SOURCE_TYPE_INCIDENT) {
    return (
      <IncidentDetailModal
        open
        incident={incident}
        sites={sites}
        currentUserId={user?.id}
        isLoading={false}
        onClose={onClose}
      />
    );
  }

  if (target.sourceType === CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT) {
    return (
      <VoiceKnowledgeDetailModal
        open
        note={knowledge}
        isLoading={false}
        canApprove={false}
        onClose={onClose}
      />
    );
  }

  return null;
};
