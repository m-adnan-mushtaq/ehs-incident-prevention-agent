import { cn } from "@/lib/utils";
import type { TChatMode } from "@/types/chat";
import { Camera, MessageCircle, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CHAT_MODES } from "../utils/chat.constants";

type Props = {
  value: TChatMode;
  onChange: (mode: TChatMode) => void;
};

const MODE_META: Record<TChatMode, { icon: LucideIcon; shortLabel: string }> = {
  normal_chat: { icon: MessageCircle, shortLabel: "General" },
  incident_prevention: { icon: ShieldAlert, shortLabel: "Prevention" },
  image_check: { icon: Camera, shortLabel: "Image" },
};

export const ChatModePickerCompact = ({ value, onChange }: Props) => (
  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Chat mode">
    {CHAT_MODES.map((m) => {
      const selected = value === m.value;
      const { icon: Icon, shortLabel } = MODE_META[m.value];
      return (
        <button
          key={m.value}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(m.value)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg border px-1.5 py-2 transition",
            selected
              ? "border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
          <span className="text-[10px] font-semibold leading-tight">{shortLabel}</span>
        </button>
      );
    })}
  </div>
);
