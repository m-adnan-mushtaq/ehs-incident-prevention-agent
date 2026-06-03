import { cn } from "@/lib/utils";
import { FilePenLine, Mic } from "lucide-react";

type Mode = "voice" | "manual";

type Props = {
  onSelect: (mode: Mode) => void;
};

const options: {
  mode: Mode;
  icon: typeof Mic;
  title: string;
  description: string;
  accent: string;
}[] = [
  {
    mode: "voice",
    icon: Mic,
    title: "Record with voice",
    description:
      "Speak your observation. We transcribe and structure it into safety fields.",
    accent: "border-blue-200 bg-blue-50/80 hover:border-blue-300 hover:bg-blue-50",
  },
  {
    mode: "manual",
    icon: FilePenLine,
    title: "Enter manually",
    description:
      "Type safety insights directly when you already know what to capture.",
    accent: "border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-50",
  },
];

export const VoiceKnowledgeModePicker = ({ onSelect }: Props) => (
  <div className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-2">
    {options.map(({ mode, icon: Icon, title, description, accent }) => (
      <button
        key={mode}
        type="button"
        onClick={() => onSelect(mode)}
        className={cn(
          "flex flex-col items-start gap-4 rounded-xl border p-6 text-left shadow-sm transition-colors",
          accent,
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
          <Icon
            className={cn(
              "h-6 w-6",
              mode === "voice" ? "text-blue-600" : "text-slate-700",
            )}
          />
        </span>
        <span>
          <span className="block text-lg font-semibold text-slate-950">
            {title}
          </span>
          <span className="mt-2 block text-sm leading-relaxed text-slate-600">
            {description}
          </span>
        </span>
      </button>
    ))}
  </div>
);
