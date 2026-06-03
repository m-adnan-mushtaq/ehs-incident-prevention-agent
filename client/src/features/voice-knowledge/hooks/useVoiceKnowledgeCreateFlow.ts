import type { UserRole } from "@/types/user";
import type { IVoiceKnowledgeFormValues } from "@/types/voice-knowledge";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SITE_NONE_VALUE } from "../components/VoiceExtractionReview";
import {
  getSaveStatusMessage,
  mapVoiceExtractionToKnowledgePayload,
} from "../utils/mapVoiceExtractionToKnowledgePayload";
import {
  getSuccessToastForRole,
  useCreateVoiceKnowledge,
} from "./useCreateVoiceKnowledge";
import { useExtractedReviewState } from "./useExtractedReviewState";
import { useVoiceExtraction } from "./useVoiceExtraction";

export type CreateStep = "choose" | "voice-record" | "form";

export const useVoiceKnowledgeCreateFlow = (role: UserRole | string | null) => {
  const [step, setStep] = useState<CreateStep>("choose");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [isManual, setIsManual] = useState(false);

  const {
    review,
    formValues,
    extraction,
    reviewKey,
    applyExtraction,
    startManualReview,
    clearReview,
  } = useExtractedReviewState();

  const extractMutation = useVoiceExtraction();
  const createMutation = useCreateVoiceKnowledge();

  const revokePreview = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    return () => revokePreview(previewUrl);
  }, [previewUrl, revokePreview]);

  const resetFlow = useCallback(() => {
    setStep("choose");
    setIsManual(false);
    setAudioBlob(null);
    clearReview();
    revokePreview(previewUrl);
    setPreviewUrl(null);
    setMicError(null);
  }, [clearReview, previewUrl, revokePreview]);

  const startVoice = () => {
    setIsManual(false);
    clearReview();
    setStep("voice-record");
  };

  const startManual = () => {
    setIsManual(true);
    setAudioBlob(null);
    revokePreview(previewUrl);
    setPreviewUrl(null);
    startManualReview();
    setStep("form");
  };

  const handleRecordingComplete = (blob: Blob) => {
    setMicError(null);
    clearReview();
    setAudioBlob(blob);
    revokePreview(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const resetRecording = () => {
    setAudioBlob(null);
    clearReview();
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
      applyExtraction(result);
      setStep("form");
      toast.success("Structured safety knowledge extracted.");
    } catch {
      /* toast in hook */
    }
  };

  const handleSave = async (values: IVoiceKnowledgeFormValues) => {
    const payload = mapVoiceExtractionToKnowledgePayload({
      extraction: extraction ?? {},
      role,
      siteIds:
        values.site_id && values.site_id !== SITE_NONE_VALUE
          ? [values.site_id]
          : undefined,
      overrides: {
        ...values,
        sme_notes: values.sme_notes,
        required_ppe: values.required_ppe,
        stop_work_triggers: values.stop_work_triggers,
      },
    });
    await createMutation.mutateAsync(payload);
    toast.success(getSuccessToastForRole(role as UserRole | null));
  };

  const goBack = () => {
    if (step === "form" && !isManual) {
      setStep("voice-record");
      return;
    }
    resetFlow();
  };

  const canSave =
    step === "form" &&
    Boolean(formValues) &&
    !createMutation.isPending &&
    !extractMutation.isPending;

  return {
    step,
    isManual,
    audioBlob,
    previewUrl,
    micError,
    formValues,
    extraction,
    reviewKey,
    review,
    extractMutation,
    createMutation,
    saveStatusHint: getSaveStatusMessage(role),
    canSave,
    startVoice,
    startManual,
    resetFlow,
    goBack,
    handleRecordingComplete,
    resetRecording,
    handleExtract,
    handleSave,
    setMicError,
  };
};
