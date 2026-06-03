import type { IIncidentPreventionBrief } from "@/types/chat";
import { ChatAnswerCard } from "./ChatAnswerCard";

type Props = { card: IIncidentPreventionBrief; answer?: string };

export const IncidentPreventionBriefCard = ({ card, answer }: Props) => (
  <div className="space-y-4">
    {card.task && (
      <div className="rounded-md border border-blue-200 bg-blue-50/60 px-3 py-2">
        <p className="text-xs font-semibold uppercase text-blue-800">Task</p>
        <p className="mt-1 text-sm text-slate-900">{card.task}</p>
      </div>
    )}
    <ChatAnswerCard card={card} answer={answer} />
    {card.similar_incidents && card.similar_incidents.length > 0 && (
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-900">
          Similar incidents
        </h4>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-800">
          {card.similar_incidents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
