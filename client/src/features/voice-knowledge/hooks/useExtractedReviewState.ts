import type {
  IVoiceExtractionData,
  IVoiceKnowledgeFormValues,
} from "@/types/voice-knowledge";
import { useCallback, useState } from "react";
import {
  emptyFormValues,
  extractionToFormValues,
} from "../components/VoiceExtractionReview";
import { normalizeExtractionData } from "../utils/normalizeExtraction";

export type IExtractedReviewState = {
  extraction: IVoiceExtractionData;
  formValues: IVoiceKnowledgeFormValues;
  reviewKey: string;
};

export const useExtractedReviewState = () => {
  const [review, setReview] = useState<IExtractedReviewState | null>(null);

  const applyExtraction = useCallback((raw: IVoiceExtractionData) => {
    const extraction = normalizeExtractionData(raw);
    setReview({
      extraction,
      formValues: extractionToFormValues(extraction),
      reviewKey: String(Date.now()),
    });
  }, []);

  const clearReview = useCallback(() => setReview(null), []);

  const startManualReview = useCallback(() => {
    setReview({
      extraction: {},
      formValues: emptyFormValues(),
      reviewKey: String(Date.now()),
    });
  }, []);

  return {
    review,
    showReviewForm: review !== null,
    formValues: review?.formValues ?? null,
    extraction: review?.extraction ?? null,
    reviewKey: review?.reviewKey ?? null,
    applyExtraction,
    startManualReview,
    clearReview,
  };
};
