import type {
  IImageSafetyCheckCard,
  IIncidentPreventionBrief,
  IKnowledgeCard,
  TChatMode,
} from "@/types/chat";
import { ChatAnswerCard } from "./ChatAnswerCard";
import { ImageSafetyCheckCard } from "./ImageSafetyCheckCard";

type Props = {
  mode?: string;
  card?: Record<string, unknown> | null;
  answer?: string;
};

const asCard = <T,>(card?: Record<string, unknown> | null): T =>
  (card ?? {}) as T;

export const StructuredAssistantResponse = ({ mode, card, answer }: Props) => {
  const m = (mode ?? "normal_chat") as TChatMode;

  if (m === "image_check") {
    return (
      <ImageSafetyCheckCard
        card={asCard<IImageSafetyCheckCard>(card)}
        answer={answer}
      />
    );
  }

  return (
    <ChatAnswerCard
      card={asCard<IIncidentPreventionBrief | IKnowledgeCard>(card)}
      answer={answer}
      mode={m}
    />
  );
};
