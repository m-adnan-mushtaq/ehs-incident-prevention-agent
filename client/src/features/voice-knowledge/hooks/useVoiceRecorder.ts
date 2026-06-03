import { useCallback, useEffect, useRef, useState } from "react";

const getPreferredMimeType = (): string => {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
};

type UseVoiceRecorderOptions = {
  onRecordingComplete: (blob: Blob) => void;
  onMicError: (message: string | null) => void;
};

export const useVoiceRecorder = ({
  onRecordingComplete,
  onMicError,
}: UseVoiceRecorderOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef("audio/webm");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearTimer();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      stopStream();
    },
    [clearTimer, stopStream]
  );

  const startRecording = useCallback(async () => {
    onMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });
      streamRef.current = stream;
      const mimeType = getPreferredMimeType();
      mimeTypeRef.current = mimeType || "audio/webm";

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeTypeRef.current,
        audioBitsPerSecond: 128000,
      });
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        clearTimer();
        setIsRecording(false);
        setElapsedSec(0);
        stopStream();
        const blob = new Blob(chunksRef.current, {
          type: mimeTypeRef.current,
        });
        if (blob.size > 0) {
          onRecordingComplete(blob);
        }
        mediaRecorderRef.current = null;
      };

      recorder.onerror = () => {
        onMicError("Recording failed. Please try again.");
        setIsRecording(false);
        clearTimer();
        stopStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecording(true);
      setElapsedSec(0);
      timerRef.current = setInterval(() => {
        setElapsedSec((s) => s + 1);
      }, 1000);
    } catch {
      onMicError(
        "Microphone access is blocked. Allow microphone permission in your browser and try again."
      );
    }
  }, [clearTimer, onMicError, onRecordingComplete, stopStream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return { isRecording, elapsedSec, startRecording, stopRecording };
};
