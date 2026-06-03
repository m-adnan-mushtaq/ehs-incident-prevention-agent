import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { CACHE_KEYS } from "@/constants/common";
import { getUserRole } from "@/lib/user-role";
import { useAuthStore } from "@/store/auth";
import type { IVoiceExtractionData, IVoiceKnowledgeFormValues } from "@/types/voice-knowledge";
import { sitesService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VoiceKnowledgeDetailModal } from "./components/VoiceKnowledgeDetailModal";
import { VoiceKnowledgeForm } from "./components/VoiceKnowledgeForm";
import { VoiceRecorderCard } from "./components/VoiceRecorderCard";
import { createPaginatedVoiceKnowledgeList } from "./components/VoiceKnowledgeList";
import { extractionToFormValues } from "./components/VoiceExtractionReview";
import {
  getSaveStatusMessage,
  mapVoiceExtractionToKnowledgePayload,
} from "./utils/mapVoiceExtractionToKnowledgePayload";
import { useCreateVoiceKnowledge, getSuccessToastForRole } from "./hooks/useCreateVoiceKnowledge";
import { useVoiceExtraction } from "./hooks/useVoiceExtraction";
import { useVoiceKnowledgeDetail } from "./hooks/useVoiceKnowledgeDetail";
import toast from "react-hot-toast";

const FORM_ID = "voice-knowledge-form";

const VoiceKnowledgePage = () => {
  const user = useAuthStore((s) => s.user);
  const role = getUserRole(user);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extraction, setExtraction] = useState<IVoiceExtractionData | null>(null);
  const [formDefaults, setFormDefaults] = useState<IVoiceKnowledgeFormValues | null>(
    null
  );
  const [micError, setMicError] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const extractMutation = useVoiceExtraction();
  const createMutation = useCreateVoiceKnowledge();
  const { data: sites = [] } = useQuery({
    queryKey: CACHE_KEYS.sites.listAll,
    queryFn: sitesService.getAllSites,
  });
  const { data: detailNote, isLoading: detailLoading } = useVoiceKnowledgeDetail(detailId);

  const PaginatedList = useMemo(
    () => createPaginatedVoiceKnowledgeList((note) => setDetailId(note.id)),
    []
  );

  const revokePreview = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    return () => revokePreview(previewUrl);
  }, [previewUrl, revokePreview]);

  const handleRecordingComplete = (blob: Blob) => {
    setMicError(null);
    setExtraction(null);
    setFormDefaults(null);
    setAudioBlob(blob);
    revokePreview(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const handleReRecord = () => {
    setAudioBlob(null);
    setExtraction(null);
    setFormDefaults(null);
    revokePreview(previewUrl);
    setPreviewUrl(null);
  };

  const handleExtract = async () => {
    if (!audioBlob) {
      toast.error("Record audio before extracting knowledge.");
      return;
    }
    try {
      const result = await extractMutation.mutateAsync(audioBlob);
      setExtraction(result);
      setFormDefaults(extractionToFormValues(result));
      toast.success("Structured safety knowledge extracted.");
    } catch {
      /* toast in hook */
    }
  };

  const handleSave = async (values: IVoiceKnowledgeFormValues) => {
    if (!extraction) return;
    const payload = mapVoiceExtractionToKnowledgePayload({
      extraction,
      role,
      siteIds: values.site_id ? [values.site_id] : undefined,
      overrides: {
        ...values,
        sme_notes: values.sme_notes,
        required_ppe: values.required_ppe,
        stop_work_triggers: values.stop_work_triggers,
      },
    });
    await createMutation.mutateAsync(payload);
    toast.success(getSuccessToastForRole(role));
    handleReRecord();
  };

  const showReview = Boolean(formDefaults && extraction);
  const canSave = showReview && !createMutation.isPending && !extractMutation.isPending;

  return (
    <Container className="text-slate-200 pb-16">
      <div className="sticky top-0 z-10 -mx-4 mb-6 border-b border-slate-800/80 bg-[#0c1424]/95 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-100 md:text-2xl">
              Voice Knowledge Notes
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Record field observations, lessons learned, and safety expertise as
              structured knowledge.
            </p>
          </div>
          {showReview && (
            <Button
              type="submit"
              form={FORM_ID}
              disabled={!canSave}
              className="shrink-0 bg-sky-600 hover:bg-sky-500"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving voice note...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <VoiceRecorderCard
          audioBlob={audioBlob}
          previewUrl={previewUrl}
          isExtracting={extractMutation.isPending}
          hasExtraction={Boolean(extraction)}
          micError={micError}
          onRecordingComplete={handleRecordingComplete}
          onExtract={handleExtract}
          onReRecord={handleReRecord}
          onMicError={setMicError}
        />
        {extractMutation.isPending && (
          <div className="flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/30 p-8 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-sky-400" />
            <span className="ml-2">Extracting structured safety knowledge...</span>
          </div>
        )}
      </div>

      {showReview && formDefaults && (
        <div className="mt-8">
          <VoiceKnowledgeForm
            formId={FORM_ID}
            defaultValues={formDefaults}
            confidenceScore={extraction?.confidence_score}
            saveStatusHint={getSaveStatusMessage(role)}
            sites={sites}
            disabled={createMutation.isPending}
            onSubmit={handleSave}
          />
        </div>
      )}

      <div className="mt-12">
        <PaginatedList />
      </div>

      <VoiceKnowledgeDetailModal
        open={Boolean(detailId)}
        onClose={() => setDetailId(null)}
        note={detailNote ?? null}
        isLoading={detailLoading}
      />
    </Container>
  );
};

export default VoiceKnowledgePage;
