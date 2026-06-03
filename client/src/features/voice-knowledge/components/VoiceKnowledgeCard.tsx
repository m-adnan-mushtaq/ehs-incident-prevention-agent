import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/helpers/common";
import type { IKnowledgeObject } from "@/types/knowledge-object";
import { Eye } from "lucide-react";
import { VoiceKnowledgeRiskBadge } from "./VoiceKnowledgeRiskBadge";
import { VoiceKnowledgeStatusBadge } from "./VoiceKnowledgeStatusBadge";

type Props = {
  note: IKnowledgeObject;
  onView: (note: IKnowledgeObject) => void;
};

const excerpt = (note: IKnowledgeObject) =>
  note.lesson_learned ||
  note.problem ||
  note.recommended_action ||
  note.safety_warning ||
  "No summary available.";

export const VoiceKnowledgeCard = ({ note, onView }: Props) => {
  const confidence =
    note.confidence_score != null
      ? Math.round(Number(note.confidence_score) * 100)
      : null;

  return (
    <Card className="border-slate-800 bg-[#0c1424] transition-colors hover:border-slate-700">
      <CardHeader className="space-y-3 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold text-slate-100 line-clamp-2">
            {note.title}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <VoiceKnowledgeStatusBadge status={note.status} />
            {note.risk_level && <VoiceKnowledgeRiskBadge risk={note.risk_level} />}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {note.topic && <span>{note.topic}</span>}
          {note.asset_name && <span>{note.asset_name}</span>}
          {confidence != null && <span>{confidence}% confidence</span>}
          {note.created_at && <span>{formatDateTime(note.created_at)}</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-400 line-clamp-3">{excerpt(note)}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-slate-700 text-slate-200"
          onClick={() => onView(note)}
        >
          <Eye className="h-4 w-4" />
          View details
        </Button>
      </CardContent>
    </Card>
  );
};
