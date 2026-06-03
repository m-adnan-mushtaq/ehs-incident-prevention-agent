import { Loader2 } from "lucide-react";

type Props = { message?: string | null; connecting?: boolean };

export const ChatThinkingStatus = ({ message, connecting }: Props) => {
  if (!message && !connecting) return null;

  return (
    <div
      className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-700" />
      <span>{connecting ? "Connecting to safety assistant..." : message}</span>
    </div>
  );
};
