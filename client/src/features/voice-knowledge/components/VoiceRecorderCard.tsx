import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mic, MicOff, RotateCcw, Sparkles } from "lucide-react";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

type Props = {
  audioBlob: Blob | null;
  previewUrl: string | null;
  isExtracting: boolean;
  hasExtraction: boolean;
  micError: string | null;
  onRecordingComplete: (blob: Blob) => void;
  onExtract: () => void;
  onReRecord: () => void;
  onMicError: (message: string | null) => void;
};

const formatElapsed = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const VoiceRecorderCard = ({
  audioBlob,
  previewUrl,
  isExtracting,
  hasExtraction,
  micError,
  onRecordingComplete,
  onExtract,
  onReRecord,
  onMicError,
}: Props) => {
  const { isRecording, elapsedSec, startRecording, stopRecording } =
    useVoiceRecorder({
      onRecordingComplete,
      onMicError,
    });

  return (
    <Card className="border-slate-800 bg-[#0c1424]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Mic className="h-5 w-5 text-sky-400" />
          Record Safety Note
        </CardTitle>
        <CardDescription className="text-slate-400">
          Capture field observations, near misses, or expert safety guidance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {micError && (
          <Alert variant="destructive" className="border-red-900/50 bg-red-950/30">
            <AlertDescription>{micError}</AlertDescription>
          </Alert>
        )}

        {!audioBlob ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            {isRecording ? (
              <>
                <div className="flex items-center gap-3 text-red-400">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                  </span>
                  <span className="text-sm font-medium text-slate-200">
                    Recording… {formatElapsed(elapsedSec)}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-800/60 text-red-200 hover:bg-red-950/40"
                  onClick={stopRecording}
                >
                  <MicOff className="h-4 w-4" />
                  Stop and save recording
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-500">
                  Press record, speak clearly, then stop when finished. Audio is
                  kept in this session only until you extract or re-record.
                </p>
                <Button
                  type="button"
                  className="bg-sky-600 hover:bg-sky-500"
                  onClick={startRecording}
                >
                  <Mic className="h-4 w-4" />
                  Start recording
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {previewUrl && (
              <audio
                controls
                src={previewUrl}
                className="w-full rounded-md"
                preload="metadata"
              />
            )}
            {hasExtraction && (
              <p className="text-sm text-emerald-400/90">
                Structured knowledge extracted. Review the fields below before saving.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="bg-sky-600 hover:bg-sky-500"
                disabled={isExtracting}
                onClick={onExtract}
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Extract Knowledge
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isExtracting}
                onClick={onReRecord}
              >
                <RotateCcw className="h-4 w-4" />
                Re-record
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
