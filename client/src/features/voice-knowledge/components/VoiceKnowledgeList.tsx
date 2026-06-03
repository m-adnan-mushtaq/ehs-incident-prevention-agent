import withPaginatedQuery, {
  PaginationWrapperProps,
} from "@/components/hoc/withPaginatedQuery";
import { CACHE_KEYS } from "@/constants/common";
import { knowledgeObjectsService } from "@/services";
import type { IKnowledgeObject } from "@/types/knowledge-object";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { VOICE_SOURCE_TYPE } from "../utils/voiceKnowledge.constants";
import { VoiceKnowledgeCard } from "./VoiceKnowledgeCard";

export type VoiceKnowledgeListProps = PaginationWrapperProps<IKnowledgeObject> & {
  onView: (note: IKnowledgeObject) => void;
};

export const VoiceKnowledgeListContent = ({
  data,
  isLoading,
  totalRecords,
  paginationModel,
  setPaginationModel,
  onView,
}: VoiceKnowledgeListProps) => {
  const pageCount = Math.max(1, Math.ceil(totalRecords / paginationModel.pageSize));

  return (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-100">Previous voice notes</h2>
      <span className="text-sm text-slate-500">{totalRecords} total</span>
    </div>
    {isLoading ? (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
        <span className="ml-2">Loading voice notes...</span>
      </div>
    ) : data.length === 0 ? (
      <p className="rounded-lg border border-dashed border-slate-800 py-12 text-center text-sm text-slate-500">
        No voice knowledge notes yet. Record a safety note to begin building trusted
        field knowledge.
      </p>
    ) : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((note) => (
          <VoiceKnowledgeCard key={note.id} note={note} onView={onView} />
        ))}
      </div>
    )}
    {totalRecords > paginationModel.pageSize && (
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={paginationModel.pageIndex === 0}
          onClick={() =>
            setPaginationModel((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))
          }
        >
          Previous
        </Button>
        <span className="text-sm text-slate-500">
          Page {paginationModel.pageIndex + 1} of {pageCount}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={paginationModel.pageIndex >= pageCount - 1}
          onClick={() =>
            setPaginationModel((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))
          }
        >
          Next
        </Button>
      </div>
    )}
  </section>
  );
};

export const createPaginatedVoiceKnowledgeList = (
  onView: (note: IKnowledgeObject) => void
) =>
  withPaginatedQuery(
    (props: PaginationWrapperProps<IKnowledgeObject>) => (
      <VoiceKnowledgeListContent {...props} onView={onView} />
    ),
    {
      queryKey: [...CACHE_KEYS.voiceKnowledge.all],
      queryFn: (params) =>
        knowledgeObjectsService.getPaginatedKnowledgeObjects({
          ...params,
          source_type: VOICE_SOURCE_TYPE,
        }),
      defaultAdditionalFilters: { source_type: VOICE_SOURCE_TYPE },
    }
  );
