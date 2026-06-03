import type { TChatMode } from "@/types/chat";
import { Shield } from "lucide-react";
import { CHAT_MODE_LABELS, CHAT_QUICK_PROMPTS } from "../utils/chat.constants";

type Props = {
  onSelectPrompt: (text: string) => void;
  mode?: TChatMode;
};

const MODE_SUBTITLES: Record<TChatMode, string> = {
  normal_chat: "Ask a safety question and get guidance from official sources.",
  incident_prevention:
    "Describe an upcoming task and get a prevention brief with similar past incidents.",
  image_check:
    "Upload a workplace image and ask about hazards or compliance.",
};

export const ChatEmptyState = ({
  onSelectPrompt,
  mode = "incident_prevention",
}: Props) => {
  const prompts = CHAT_QUICK_PROMPTS[mode] ?? CHAT_QUICK_PROMPTS.incident_prevention;

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        <Shield className="h-7 w-7" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">
        {CHAT_MODE_LABELS[mode] ?? "Start a safety check"}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        {MODE_SUBTITLES[mode]}
      </p>
      <div className="mt-8 grid w-full gap-2 text-left">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
