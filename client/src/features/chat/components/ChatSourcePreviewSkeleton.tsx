import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CHAT_SOURCE_TYPE_DOCUMENT,
  CHAT_SOURCE_TYPE_INCIDENT,
  CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT,
} from "../constants/chat-source.constants";

type Props = {
  open: boolean;
  sourceType: string;
  onClose: () => void;
};

const DocumentSkeleton = () => (
  <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
    <aside className="space-y-4 border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </aside>
    <section className="p-4">
      <Skeleton className="h-[70vh] min-h-[540px] w-full rounded-md" />
    </section>
  </div>
);

const IncidentSkeleton = () => (
  <div className="space-y-6 p-6">
    <Skeleton className="h-24 w-full rounded-lg" />
    <Skeleton className="h-32 w-full rounded-lg" />
    <Skeleton className="h-40 w-full rounded-lg" />
  </div>
);

const KnowledgeSkeleton = () => (
  <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton className="h-20 w-full rounded-md" />
    </div>
    <Skeleton className="h-48 w-full rounded-lg" />
  </div>
);

export const ChatSourcePreviewSkeleton = ({ open, sourceType, onClose }: Props) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="max-h-[92vh] min-w-[min(1080px,calc(100vw-2rem))] overflow-y-auto border-slate-200 bg-white p-0">
      <DialogHeader className="border-b border-slate-200 px-6 py-5">
        <Skeleton className="h-7 w-2/3 max-w-md" />
        <Skeleton className="mt-3 h-4 w-1/3 max-w-xs" />
      </DialogHeader>
      {sourceType === CHAT_SOURCE_TYPE_DOCUMENT && <DocumentSkeleton />}
      {sourceType === CHAT_SOURCE_TYPE_INCIDENT && <IncidentSkeleton />}
      {sourceType === CHAT_SOURCE_TYPE_KNOWLEDGE_OBJECT && <KnowledgeSkeleton />}
    </DialogContent>
  </Dialog>
);
