import withPaginatedQuery, {
  PaginationWrapperProps,
} from "@/components/hoc/withPaginatedQuery";
import { EmptyState, LoadingState, SectionCard } from "@/components/shared/safety-ui";
import { CACHE_KEYS } from "@/constants/common";
import { knowledgeObjectsService } from "@/services";
import type { IKnowledgeObject } from "@/types/knowledge-object";
import { Button } from "@/components/ui/button";
import { ThemeInput } from "@/components/form/ThemeInput";
import { Mic, Search } from "lucide-react";
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
  handleSearch,
  search,
  onView,
}: VoiceKnowledgeListProps) => {
  const pageCount = Math.max(1, Math.ceil(totalRecords / paginationModel.pageSize));

  return (
  <SectionCard
    title="Previous voice notes"
    description={`${totalRecords} total field knowledge notes`}
    contentClassName="space-y-4"
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:max-w-80">
        <ThemeInput
          startIcon={Search}
          className="rounded-md border-slate-200 bg-white"
          placeholder="Search voice notes..."
          value={search}
          onChange={handleSearch}
        />
      </div>
    </div>
    {isLoading ? (
      <LoadingState label="Loading voice notes..." />
    ) : data.length === 0 ? (
      <EmptyState
        title="No voice knowledge notes yet"
        description="Record a safety note to begin building trusted field knowledge."
        icon={Mic}
      />
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
  </SectionCard>
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
