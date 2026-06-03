import Container from "@/components/layout/container";
import DataTable from "@/components/shared/data-table";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import withPaginatedQuery, {
  PaginationWrapperProps,
} from "@/components/hoc/withPaginatedQuery";
import { CACHE_KEYS } from "@/constants/common";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { sitesService } from "@/services";
import type { ICreateSitePayload, ISite } from "@/types/site";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useColumns } from "./hooks/useColumns";
import { SiteDialog } from "./components/SiteDialog";
import { useCreateSite } from "./hooks/useCreateSite";
import { useUpdateSite } from "./hooks/useUpdateSite";
import { useDeleteSite } from "./hooks/useDeleteSite";

const SitesPage = ({
  data,
  paginationModel,
  isLoading,
  setSortModel,
  sortModel,
  setPaginationModel,
  totalRecords,
}: PaginationWrapperProps<ISite>) => {
  const { modalState, modalStateHandler } = useModal();
  const [selectedSite, setSelectedSite] = useState<ISite>();
  const createMutation = useCreateSite();
  const updateMutation = useUpdateSite();
  const deleteMutation = useDeleteSite();

  const { columns } = useColumns({
    handleEdit: (site) => {
      setSelectedSite(site);
      modalStateHandler(MODAL_TYPE.EDIT, true);
    },
    handleDelete: (site) => {
      setSelectedSite(site);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
  });

  const dialogOpen = modalState.create || modalState.edit;

  return (
    <Container className="text-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Sites</h2>
          <p className="text-sm text-slate-500">
            Operational locations for field teams and site-scoped documents.
          </p>
        </div>
        <Button
          className="bg-sky-600 hover:bg-sky-500"
          onClick={() => {
            setSelectedSite(undefined);
            modalStateHandler(MODAL_TYPE.CREATE, true);
          }}
        >
          <Plus className="h-4 w-4" /> Add site
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
        emptyPlaceholder="No sites configured yet."
      />
      <SiteDialog
        open={dialogOpen}
        site={selectedSite}
        loading={createMutation.isPending || updateMutation.isPending}
        onClose={() => {
          modalStateHandler(MODAL_TYPE.CREATE, false);
          modalStateHandler(MODAL_TYPE.EDIT, false);
        }}
        onSubmit={async (values) => {
          if (selectedSite) {
            await updateMutation.mutateAsync({
              id: selectedSite.id,
              payload: values,
            });
          } else {
            await createMutation.mutateAsync(values as ICreateSitePayload);
          }
        }}
      />
      <ConfirmationDialog
        open={modalState.delete}
        handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
        handleDelete={async () => {
          if (selectedSite) await deleteMutation.mutateAsync(selectedSite.id);
          modalStateHandler(MODAL_TYPE.DELETE, false);
        }}
        title="Archive this site?"
        loading={deleteMutation.isPending}
      />
    </Container>
  );
};

export default withPaginatedQuery(SitesPage, {
  queryKey: [...CACHE_KEYS.sites.all],
  queryFn: sitesService.getPaginatedSites,
});
