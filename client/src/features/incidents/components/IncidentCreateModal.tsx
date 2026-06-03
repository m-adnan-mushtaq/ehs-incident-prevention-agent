import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VoiceRecorderCard } from "@/features/voice-knowledge/components/VoiceRecorderCard";
import { getUserRole } from "@/lib/user-role";
import { useAuthStore } from "@/store/auth";
import type { ISite } from "@/types/site";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useIncidentCreateFlow } from "../hooks/useIncidentCreateFlow";
import { IncidentForm } from "./IncidentForm";
import { IncidentModePicker } from "./IncidentModePicker";

const FORM_ID = "incident-voice-create-form";

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
      active ? "font-medium text-amber-700" : "text-slate-400"
    }
  >
    {label}
  </span>
);

export const IncidentCreateModal = ({ open, sites, onClose }: Props) => {
  const user = useAuthStore((s) => s.user);
  const role = getUserRole(user);
  const flow = useIncidentCreateFlow(role);

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
      ? "Report incident"
      : flow.step === "voice-record"
        ? "Describe the incident"
        : flow.isManual
          ? "Enter incident details"
          : "Review and report";

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
                    "Choose how you want to report this safety event."}
                  {flow.step === "voice-record" &&
                    "Describe clearly what happened, then extract structured details with AI."}
                  {flow.step === "form" &&
                    "Confirm details before reporting the incident."}
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
                    Reporting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Report incident
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-6 py-8">
          {flow.step === "choose" && (
            <IncidentModePicker
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
                  <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                  <span className="ml-2">
                    Extracting incident details from your recording...
                  </span>
                </div>
              )}
            </div>
          )}

          {flow.step === "form" && flow.formValues && (
            <div className="mx-auto max-w-4xl">
              <IncidentForm
                key={flow.reviewKey}
                formId={FORM_ID}
                sites={sites}
                role={role}
                loading={flow.createMutation.isPending}
                onSubmit={async (values) => {
                  await flow.handleSave(values);
                  handleClose();
                }}
                onClose={handleClose}
                defaultValues={flow.formValues}
                hideActions
                confidenceScore={flow.extraction?.confidence_score}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
