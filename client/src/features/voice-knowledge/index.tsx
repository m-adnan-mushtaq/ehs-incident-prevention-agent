import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { CACHE_KEYS } from "@/constants/common";
import { getUserRole } from "@/lib/user-role";
import { useAuthStore } from "@/store/auth";
import { sitesService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { VoiceKnowledgeCreateModal } from "./components/VoiceKnowledgeCreateModal";
import { VoiceKnowledgeDetailModal } from "./components/VoiceKnowledgeDetailModal";
import { createPaginatedVoiceKnowledgeList } from "./components/VoiceKnowledgeList";
import { useApproveVoiceKnowledge } from "./hooks/useApproveVoiceKnowledge";
import { useVoiceKnowledgeDetail } from "./hooks/useVoiceKnowledgeDetail";

const VoiceKnowledgePage = () => {
  const user = useAuthStore((s) => s.user);
  const role = getUserRole(user);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const approveMutation = useApproveVoiceKnowledge();
  const { data: sites = [] } = useQuery({
    queryKey: CACHE_KEYS.sites.listAll,
    queryFn: sitesService.getAllSites,
  });
  const { data: detailNote, isLoading: detailLoading } =
    useVoiceKnowledgeDetail(detailId);

  const PaginatedList = useMemo(
    () => createPaginatedVoiceKnowledgeList((note) => setDetailId(note.id)),
    [],
  );

  return (
    <Container className="pb-16 text-slate-900">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Voice Knowledge Notes
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Capture field observations and safety expertise as structured
            knowledge for your sites.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New safety note
        </Button>
      </div>

      <PaginatedList />

      <VoiceKnowledgeCreateModal
        open={createOpen}
        sites={sites}
        onClose={() => setCreateOpen(false)}
      />

      <VoiceKnowledgeDetailModal
        open={Boolean(detailId)}
        onClose={() => setDetailId(null)}
        note={detailNote ?? null}
        isLoading={detailLoading}
        canApprove={role === "admin" || role === "sme"}
        isApproving={approveMutation.isPending}
        onApprove={async (note) => {
          await approveMutation.mutateAsync(note.id);
        }}
      />
    </Container>
  );
};

export default VoiceKnowledgePage;
