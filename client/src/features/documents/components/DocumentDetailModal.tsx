import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime, toTitleCase } from "@/helpers/common";
import { getDocumentUrl } from "@/helpers/media";
import type { IDocument } from "@/types/document";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  document: IDocument | null;
  isLoading?: boolean;
  onClose: () => void;
};

const isPdf = (document?: IDocument | null) => {
  const fileName = document?.file_name?.toLowerCase() ?? "";
  const fileType = document?.file_type?.toLowerCase() ?? "";
  const url = document?.file_url?.toLowerCase() ?? "";
  return (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    url.endsWith(".pdf")
  );
};

const DetailItem = ({ label, value }: { label: string; value?: ReactNode }) => (
  <div>
    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </dt>
    <dd className="mt-1 text-sm text-slate-900">{value || "-"}</dd>
  </div>
);

export const DocumentDetailModal = ({
  open,
  document,
  isLoading,
  onClose,
}: Props) => {
  const documentUrl = getDocumentUrl(document);
  const canPreviewPdf = Boolean(documentUrl && isPdf(document));

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[92vh]  min-w-[80vw] overflow-y-auto border-slate-200 bg-white p-0 text-slate-950">
        {isLoading || !document ? (
          <div className="flex items-center justify-center py-24 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2">Loading document details...</span>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <DialogTitle className="flex items-center gap-2 text-xl text-slate-950">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {document.title}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-slate-500">
                    {document.description ||
                      document.file_name ||
                      "Document details"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={document.status} />
                  {documentUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={documentUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
              <aside className="border-b border-slate-200 bg-slate-50/70 p-6 lg:border-b-0 lg:border-r">
                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  <DetailItem label="File" value={document.file_name} />
                  <DetailItem label="Type" value={document.document_type} />
                  <DetailItem
                    label="Scope"
                    value={toTitleCase(String(document.source_scope))}
                  />
                  <DetailItem label="Topic" value={document.topic} />
                  <DetailItem label="Version" value={document.version} />
                  <DetailItem
                    label="Uploaded"
                    value={
                      document.created_at
                        ? formatDateTime(document.created_at)
                        : "-"
                    }
                  />
                </dl>
                {document.processing_error && (
                  <>
                    <Separator className="my-5" />
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {document.processing_error}
                    </div>
                  </>
                )}
              </aside>

              <section className="min-h-[560px] bg-white p-4">
                {canPreviewPdf ? (
                  <iframe
                    title={document.title}
                    src={documentUrl ?? undefined}
                    className="h-[70vh] min-h-[540px] w-full rounded-md border border-slate-200 bg-slate-50"
                  />
                ) : (
                  <div className="flex h-[540px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-center">
                    <FileText className="h-10 w-10 text-slate-400" />
                    <p className="mt-3 text-sm font-medium text-slate-900">
                      Preview is available for PDF documents.
                    </p>
                    {documentUrl && (
                      <Button className="mt-4" asChild>
                        <a href={documentUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Open document
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
