import Container from "@/components/layout/container";
import DataTable from "@/components/shared/data-table";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import withPaginatedQuery, {
  PaginationWrapperProps,
} from "@/components/hoc/withPaginatedQuery";
import { CACHE_KEYS } from "@/constants/common";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { documentsService, sitesService } from "@/services";
import type { IDocument } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useColumns } from "./hooks/useColumns";
import { DocumentUploadDrawer } from "./components/DocumentUploadDrawer";
import { DocumentDetailModal } from "./components/DocumentDetailModal";
import { useUploadDocument } from "./hooks/useUploadDocument";
import { useDeleteDocument } from "./hooks/useDeleteDocument";

const DocumentsPage = ({
  data,
  paginationModel,
  isLoading,
  setSortModel,
  sortModel,
  setPaginationModel,
  totalRecords,
  handleSearch,
  search,
}: PaginationWrapperProps<IDocument>) => {
  const { modalState, modalStateHandler } = useModal({
    create: false,
    edit: false,
    delete: false,
    view: false,
  });
  const [selectedDocument, setSelectedDocument] = useState<IDocument>();
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const { data: sites = [] } = useQuery({
    queryKey: CACHE_KEYS.sites.listAll,
    queryFn: sitesService.getAllSites,
  });
  const { data: documentDetail, isLoading: documentDetailLoading } = useQuery({
    queryKey: ["documents", "detail", selectedDocument?.id],
    queryFn: () => documentsService.getDocumentById(selectedDocument!.id),
    enabled: modalState.view && Boolean(selectedDocument?.id),
  });

  const { columns } = useColumns({
    handleView: (doc) => {
      setSelectedDocument(doc);
      modalStateHandler(MODAL_TYPE.VIEW, true);
    },
    handleDelete: (doc) => {
      setSelectedDocument(doc);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
  });

  return (
    <Container className="pb-10 text-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Document Library
          </h2>
          <p className="text-sm text-slate-500">
            Safety documents processed into your site knowledge base.
          </p>
        </div>
        <Button onClick={() => modalStateHandler(MODAL_TYPE.CREATE, true)}>
          <Upload className="h-4 w-4" /> Upload document
        </Button>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <DataTable
        columns={columns as never}
        data={data}
        total={totalRecords}
        sorting={sortModel}
        setSorting={setSortModel}
        loading={isLoading}
        pagination={paginationModel}
        setPagination={setPaginationModel}
        visiblePagination
        emptyPlaceholder="No documents have been uploaded yet. Upload safety documents to begin building the site knowledge base."
        search={search}
        onSearch={handleSearch}
      />
      </div>
      <DocumentUploadDrawer
        open={modalState.create}
        sites={sites}
        loading={uploadMutation.isPending}
        onClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
        onSubmit={async (payload) => {
          await uploadMutation.mutateAsync(payload);
          modalStateHandler(MODAL_TYPE.CREATE, false);
        }}
      />
      <DocumentDetailModal
        open={modalState.view}
        document={documentDetail ?? selectedDocument ?? null}
        isLoading={documentDetailLoading}
        onClose={() => modalStateHandler(MODAL_TYPE.VIEW, false)}
      />
      <ConfirmationDialog
        open={modalState.delete}
        handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
        handleDelete={async () => {
          if (selectedDocument) {
            await deleteMutation.mutateAsync(selectedDocument.id);
          }
          modalStateHandler(MODAL_TYPE.DELETE, false);
        }}
        title="Archive this document?"
        description={
          selectedDocument?.status === "failed"
            ? "This document could not be processed. You may upload a corrected version after archiving."
            : undefined
        }
        loading={deleteMutation.isPending}
      />
    </Container>
  );
};

export default withPaginatedQuery(DocumentsPage, {
  queryKey: [...CACHE_KEYS.documents.all],
  queryFn: documentsService.getPaginatedDocuments,
});
