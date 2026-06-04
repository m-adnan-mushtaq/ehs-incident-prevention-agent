import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DocumentForm } from "./DocumentForm";
import type { ISite } from "@/types/site";
import type { IUploadDocumentPayload } from "@/types/document";

type DocumentUploadDrawerProps = {
  open: boolean;
  sites: ISite[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: IUploadDocumentPayload) => Promise<void>;
};

export const DocumentUploadDrawer = ({
  open,
  sites,
  loading,
  onClose,
  onSubmit,
}: DocumentUploadDrawerProps) => (
  <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
    <SheetContent className="w-full overflow-y-auto border-slate-200 bg-white text-slate-950 sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Upload safety document</SheetTitle>
        <SheetDescription className="text-slate-500">
          Add approved safety material to the searchable knowledge base. Uploaded
          files are processed into citations the assistant can use in answers.
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6">
        <DocumentForm
          sites={sites}
          loading={loading}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </div>
    </SheetContent>
  </Sheet>
);
