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

  const { columns } = useColumns({
    handleDelete: (doc) => {
      setSelectedDocument(doc);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
  });

  return (
    <Container className="text-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            Document Library
          </h2>
          <p className="text-sm text-slate-500">
            Safety documents processed into your site knowledge base.
          </p>
        </div>
        <Button
          className="bg-sky-600 hover:bg-sky-500"
          onClick={() => modalStateHandler(MODAL_TYPE.CREATE, true)}
        >
          <Upload className="h-4 w-4" /> Upload document
        </Button>
      </div>
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
      />
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
