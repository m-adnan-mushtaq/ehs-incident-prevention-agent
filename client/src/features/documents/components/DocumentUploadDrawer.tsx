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
    <SheetContent className="w-full border-slate-800 bg-[#0f1729] text-slate-100 sm:max-w-lg overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Upload safety document</SheetTitle>
        <SheetDescription className="text-slate-400">
          Upload SOPs, safety manuals, checklists, or approved EHS documents for
          processing.
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
