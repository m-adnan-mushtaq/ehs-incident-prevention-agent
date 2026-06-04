import { cn } from "@/lib/utils";
import type { TChatMode } from "@/types/chat";
import { Camera, MessageCircle, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CHAT_MODES } from "../utils/chat.constants";

type Props = {
  value: TChatMode;
  onChange: (mode: TChatMode) => void;
};

const MODE_META: Record<
  TChatMode,
  { icon: LucideIcon; accent: string; ring: string }
> = {
  normal_chat: {
    icon: MessageCircle,
    accent: "bg-blue-600 text-white",
    ring: "ring-blue-500",
  },
  incident_prevention: {
    icon: ShieldAlert,
    accent: "bg-amber-600 text-white",
    ring: "ring-amber-500",
  },
  image_check: {
    icon: Camera,
    accent: "bg-emerald-600 text-white",
    ring: "ring-emerald-500",
  },
};

export const ChatModeTabs = ({ value, onChange }: Props) => (
  <div className="grid grid-cols-1 gap-2 p-3" role="tablist" aria-label="Chat mode">
    {CHAT_MODES.map((m) => {
      const selected = value === m.value;
      const meta = MODE_META[m.value];
      const Icon = meta.icon;
      return (
        <button
          key={m.value}
          type="button"
          role="tab"
          aria-selected={selected}
          onClick={() => onChange(m.value)}
          className={cn(
            "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition",
            selected
              ? cn("border-white bg-white shadow-sm ring-2", meta.ring)
              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
          )}
        >
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              selected ? meta.accent : "bg-slate-100 text-slate-600"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block text-sm font-semibold",
                selected ? "text-slate-900" : "text-slate-700"
              )}
            >
              {m.label}
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-slate-500">
              {m.description}
            </span>
          </span>
        </button>
      );
    })}
  </div>
);
