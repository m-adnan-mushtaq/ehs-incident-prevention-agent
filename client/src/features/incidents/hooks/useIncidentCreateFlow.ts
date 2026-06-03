import type { UserRole } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCreateIncident } from "./useCreateIncident";
import { useIncidentExtraction } from "./useIncidentExtraction";
import {
  buildCreatePayload,
  emptyIncidentFormValues,
  type IIncidentFormValues,
} from "../utils/incident-formatters";
import { extractionToIncidentFormValues } from "../utils/incident-extraction-helpers";
import type { IIncidentExtractionData } from "../utils/incident-extraction-helpers";

export type CreateStep = "choose" | "voice-record" | "form";

export const useIncidentCreateFlow = (_role: UserRole | string | null) => {
  const [step, setStep] = useState<CreateStep>("choose");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [isManual, setIsManual] = useState(false);
  const [formValues, setFormValues] = useState<IIncidentFormValues | null>(null);
  const [extraction, setExtraction] = useState<IIncidentExtractionData | null>(null);
  const [reviewKey, setReviewKey] = useState<string | null>(null);
  const [review, setReview] = useState<boolean>(false);

  const extractMutation = useIncidentExtraction();
  const createMutation = useCreateIncident();

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
    setFormValues(null);
    setExtraction(null);
    setReviewKey(null);
    setReview(false);
    revokePreview(previewUrl);
    setPreviewUrl(null);
    setMicError(null);
  }, [previewUrl, revokePreview]);

  const startVoice = () => {
    setIsManual(false);
    setFormValues(null);
    setExtraction(null);
    setReview(false);
    setStep("voice-record");
  };

  const startManual = () => {
    setIsManual(true);
    setAudioBlob(null);
    revokePreview(previewUrl);
    setPreviewUrl(null);
    setFormValues(emptyIncidentFormValues());
    setReviewKey(String(Date.now()));
    setReview(true);
    setStep("form");
  };

  const handleRecordingComplete = (blob: Blob) => {
    setMicError(null);
    setFormValues(null);
    setExtraction(null);
    setReview(false);
    setAudioBlob(blob);
    revokePreview(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setFormValues(null);
    setExtraction(null);
    setReview(false);
    revokePreview(previewUrl);
    setPreviewUrl(null);
  };

  const handleExtract = async () => {
    if (!audioBlob) {
      toast.error("Record audio before extracting incident details.");
      return;
    }
    try {
      const result = await extractMutation.mutateAsync(audioBlob);
      setExtraction(result);
      setFormValues(extractionToIncidentFormValues(result));
      setReviewKey(String(Date.now()));
      setReview(true);
      setStep("form");
      toast.success("Incident details extracted from recording.");
    } catch {
      /* toast in hook */
    }
  };

  const handleSave = async (values: IIncidentFormValues) => {
    const payload = buildCreatePayload(values);
    await createMutation.mutateAsync(payload);
    toast.success("Incident reported. It will be reviewed for safety learning.");
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
