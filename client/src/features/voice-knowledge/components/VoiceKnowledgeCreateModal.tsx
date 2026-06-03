import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserRole } from "@/lib/user-role";
import { useAuthStore } from "@/store/auth";
import type { ISite } from "@/types/site";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useVoiceKnowledgeCreateFlow } from "../hooks/useVoiceKnowledgeCreateFlow";
import { VoiceKnowledgeForm } from "./VoiceKnowledgeForm";
import { VoiceKnowledgeModePicker } from "./VoiceKnowledgeModePicker";
import { VoiceRecorderCard } from "./VoiceRecorderCard";

const FORM_ID = "voice-knowledge-create-form";

const FULLSCREEN_DIALOG =
  "fixed inset-0 left-0 top-0 z-50 flex h-[100dvh] w-screen min-w-[100vw] max-w-none translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-0 p-0 sm:max-w-none";

type Props = {
  open: boolean;
  sites: ISite[];
  onClose: () => void;
};

const StepIndicator = ({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) => (
  <span
    className={
      active
        ? "font-medium text-blue-700"
        : "text-slate-400"
    }
  >
    {label}
  </span>
);

export const VoiceKnowledgeCreateModal = ({
  open,
  sites,
  onClose,
}: Props) => {
  const user = useAuthStore((s) => s.user);
  const role = getUserRole(user);
  const flow = useVoiceKnowledgeCreateFlow(role);

  useEffect(() => {
    if (open) flow.resetFlow();
  }, [open]);

  const handleClose = () => {
    flow.resetFlow();
    onClose();
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) handleClose();
  };

  const title =
    flow.step === "choose"
      ? "New safety knowledge note"
      : flow.step === "voice-record"
        ? "Record your observation"
        : flow.isManual
          ? "Enter knowledge manually"
          : "Review and save";

  const showBack = flow.step !== "choose";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={FULLSCREEN_DIALOG}>
        <DialogHeader className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex flex-col gap-4 pr-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              {showBack && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-slate-600"
                  onClick={flow.goBack}
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <DialogTitle className="text-xl text-slate-950">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-1 text-slate-500">
                  {flow.step === "choose" &&
                    "Choose how you want to capture this safety knowledge."}
                  {flow.step === "voice-record" &&
                    "Record clearly, then extract structured fields with AI."}
                  {flow.step === "form" &&
                    "Confirm details before saving to the knowledge base."}
                </DialogDescription>
                {!flow.isManual && flow.step !== "choose" && (
                  <p className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    <StepIndicator
                      active={flow.step === "voice-record"}
                      label="1. Record"
                    />
                    <span>→</span>
                    <StepIndicator
                      active={flow.extractMutation.isPending}
                      label="2. Extract"
                    />
                    <span>→</span>
                    <StepIndicator
                      active={flow.step === "form"}
                      label="3. Review"
                    />
                  </p>
                )}
              </div>
            </div>
            {flow.step === "form" && flow.formValues && (
              <Button
                type="submit"
                form={FORM_ID}
                disabled={!flow.canSave}
                className="shrink-0"
              >
                {flow.createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save note
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-6 py-8">
          {flow.step === "choose" && (
            <VoiceKnowledgeModePicker
              onSelect={(mode) =>
                mode === "voice" ? flow.startVoice() : flow.startManual()
              }
            />
          )}

          {flow.step === "voice-record" && (
            <div className="mx-auto max-w-2xl space-y-6">
              <VoiceRecorderCard
                embedded
                audioBlob={flow.audioBlob}
                previewUrl={flow.previewUrl}
                isExtracting={flow.extractMutation.isPending}
                hasExtraction={Boolean(flow.review)}
                micError={flow.micError}
                onRecordingComplete={flow.handleRecordingComplete}
                onExtract={flow.handleExtract}
                onReRecord={flow.resetRecording}
                onMicError={flow.setMicError}
              />
              {flow.extractMutation.isPending && (
                <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="ml-2">
                    Extracting structured safety knowledge...
                  </span>
                </div>
              )}
            </div>
          )}

          {flow.step === "form" && flow.formValues && flow.reviewKey && (
            <div className="mx-auto max-w-4xl">
              <VoiceKnowledgeForm
                key={flow.reviewKey}
                formId={FORM_ID}
                values={flow.formValues}
                confidenceScore={flow.extraction?.confidence_score}
                saveStatusHint={flow.saveStatusHint}
                sites={sites}
                disabled={flow.createMutation.isPending}
                onSubmit={async (values) => {
                  await flow.handleSave(values);
                  handleClose();
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
