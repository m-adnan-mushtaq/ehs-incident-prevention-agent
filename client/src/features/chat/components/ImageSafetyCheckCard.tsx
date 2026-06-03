import type { IImageSafetyCheckCard } from "@/types/chat";
import { normalizeSafetyCard, toStringList } from "../utils/chat-formatters";
import { ChatAnswerCard } from "./ChatAnswerCard";
import { ChatMarkdownPreview } from "./ChatMarkdownPreview";

type Props = { card: IImageSafetyCheckCard; answer?: string };

const ListBlock = ({ title, items }: { title: string; items?: unknown }) => {
  const list = toStringList(items);
  if (!list.length) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h4>
      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-slate-800">
        {list.map((i, idx) => (
          <li key={`${title}-${idx}`}>{i}</li>
        ))}
      </ul>
    </div>
  );
};

export const ImageSafetyCheckCard = ({ card, answer }: Props) => {
  const normalized = normalizeSafetyCard(card, answer);
  const limitations = toStringList(card.limitations);
  const summary =
    (typeof card.image_safety_summary === "string"
      ? card.image_safety_summary
      : null) ||
    normalized.answer ||
    answer;

  return (
  <div className="space-y-4">
    {summary && (
      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-xs font-semibold uppercase text-slate-600">
          Image safety summary
        </p>
        <ChatMarkdownPreview
          source={summary}
          className="mt-1 text-sm text-slate-900"
        />
      </div>
    )}
    <ListBlock title="Observed hazards" items={card.observed_hazards} />
    <ListBlock title="Recommended checks" items={card.recommended_checks} />
    <ChatAnswerCard card={normalized} answer={answer} mode="image_check" />
    {limitations.length > 0 && (
      <p className="text-xs text-slate-500">
        Limitations: {limitations.join(" ")}
      </p>
    )}
  </div>
  );
};
