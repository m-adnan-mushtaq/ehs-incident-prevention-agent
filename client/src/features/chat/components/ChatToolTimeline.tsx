import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import type { IToolTimelineItem } from "../utils/chat-event-reducer";
import { TOOL_TIMELINE_STEPS } from "../utils/chat.constants";

type Props = {
  items: IToolTimelineItem[];
  collapsed?: boolean;
  mode?: string;
};

const iconFor = (status: IToolTimelineItem["status"]) => {
  switch (status) {
    case "done":
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
    case "active":
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-700" />;
    case "error":
      return <XCircle className="h-3.5 w-3.5 text-red-600" />;
    default:
      return <Circle className="h-3.5 w-3.5 text-slate-300" />;
  }
};

const getDefaultStepsForMode = (mode?: string) =>
  TOOL_TIMELINE_STEPS.filter((s) => {
    if (s.key === "image_analysis" && mode !== "image_check") return false;
    return true;
  }).map((s) => ({
    id: s.key,
    label: s.label,
    status: "pending" as const,
  }));

export const ChatToolTimeline = ({ items, collapsed, mode }: Props) => {
  if (!items.length && collapsed) return null;

  const display = items.length > 0 ? items : getDefaultStepsForMode(mode);

  return (
    <div
      className="rounded-md border border-slate-200/80 bg-white/90 px-3 py-2"
      aria-label="Safety analysis progress"
    >
      <p className="mb-2 text-xs font-medium text-slate-700">Working on your request</p>
      <ul className="space-y-1.5">
        {display.map((step) => (
          <li
            key={step.id}
            className={cn(
              "flex items-center gap-2 text-xs",
              step.status === "pending" && "text-slate-400",
              step.status !== "pending" && "text-slate-700"
            )}
          >
            {iconFor(step.status)}
            <span>{step.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
