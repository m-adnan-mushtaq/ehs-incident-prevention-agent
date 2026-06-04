import Container from "@/components/layout/container";
import DataTable from "@/components/shared/data-table";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { PageHeader, SectionCard } from "@/components/shared/safety-ui";
import withPaginatedQuery, {
  PaginationWrapperProps,
} from "@/components/hoc/withPaginatedQuery";
import { CACHE_KEYS } from "@/constants/common";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { sitesService } from "@/services";
import type { ICreateSitePayload, ISite } from "@/types/site";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
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
  handleSearch,
  search,
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
    <Container className="pb-10 text-slate-900">
      <PageHeader
        eyebrow="Site context"
        title="Sites"
        description="Operational locations for field teams, incidents, and site-scoped safety documents."
        icon={Building2}
        actions={
          <Button
            onClick={() => {
              setSelectedSite(undefined);
              modalStateHandler(MODAL_TYPE.CREATE, true);
            }}
          >
            <Plus className="h-4 w-4" /> Add site
          </Button>
        }
      />
      <SectionCard
        title="Operational locations"
        description="Active and suspended sites used for scoped guidance."
        contentClassName="p-3"
      >
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
          search={search}
          onSearch={handleSearch}
        />
      </SectionCard>
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
