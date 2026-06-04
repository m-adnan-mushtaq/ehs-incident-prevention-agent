import Container from "@/components/layout/container";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { PageHeader } from "@/components/shared/safety-ui";
import withPaginatedQuery, {
  PaginationWrapperProps,
} from "@/components/hoc/withPaginatedQuery";
import { CACHE_KEYS } from "@/constants/common";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { getUserRole } from "@/lib/user-role";
import { incidentsService, sitesService } from "@/services";
import { useAuthStore } from "@/store/auth";
import type { IIncident } from "@/types/incident";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IncidentCreateModal } from "./components/IncidentCreateModal";
import { IncidentDetailModal } from "./components/IncidentDetailModal";
import { IncidentDialog } from "./components/IncidentDialog";
import { IncidentsTable } from "./components/IncidentsTable";
import { useColumns } from "./hooks/useColumns";
import { useCreateIncident } from "./hooks/useCreateIncident";
import { useDeleteIncident } from "./hooks/useDeleteIncident";
import { useIncidentDetail } from "./hooks/useIncidentDetail";
import { useUpdateIncident } from "./hooks/useUpdateIncident";
import {
  buildCreatePayload,
  buildUpdatePayload,
  canArchiveIncident,
  canEditIncident,
  type IIncidentFormValues,
} from "./utils/incident-formatters";

const IncidentsPage = ({
  data,
  paginationModel,
  isLoading,
  setSortModel,
  sortModel,
  setPaginationModel,
  totalRecords,
  handleSearch,
  search,
  additionalFilters,
  setAdditionalFilters,
}: PaginationWrapperProps<IIncident>) => {
  const user = useAuthStore((s) => s.user);
  const role = getUserRole(user);
  const { modalState, modalStateHandler } = useModal({
    create: false,
    edit: false,
    delete: false,
    view: false,
  });
  const [selected, setSelected] = useState<IIncident>();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const createMutation = useCreateIncident();
  const updateMutation = useUpdateIncident();
  const deleteMutation = useDeleteIncident();

  const { data: sites = [] } = useQuery({
    queryKey: CACHE_KEYS.sites.listAll,
    queryFn: sitesService.getAllSites,
  });

  const { data: detailIncident, isLoading: detailLoading } = useIncidentDetail(
    modalState.view ? (selected?.id ?? null) : null
  );

  const canEdit = useCallback(
    (incident: IIncident) => canEditIncident(role, incident, user?.id),
    [role, user?.id]
  );
  const canArchive = useCallback(
    (incident: IIncident) => canArchiveIncident(role, incident, user?.id),
    [role, user?.id]
  );

  const { columns } = useColumns({
    sites,
    currentUserId: user?.id,
    canEdit,
    canArchive,
    handleView: (incident) => {
      setSelected(incident);
      modalStateHandler(MODAL_TYPE.VIEW, true);
    },
    handleEdit: (incident) => {
      setSelected(incident);
      modalStateHandler(MODAL_TYPE.EDIT, true);
    },
    handleDelete: (incident) => {
      setSelected(incident);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
  });

  const dialogOpen = modalState.edit;
  const includeStatus = role === "admin" || role === "sme";

  const handleFormSubmit = async (values: IIncidentFormValues) => {
    if (selected && modalState.edit) {
      await updateMutation.mutateAsync({
        id: selected.id,
        payload: buildUpdatePayload(values, includeStatus),
      });
    } else {
      await createMutation.mutateAsync(buildCreatePayload(values));
    }
  };

  return (
    <Container className="pb-10 text-slate-900">
      <PageHeader
        eyebrow="Incident learning system"
        title="Incidents"
        description="Report, review, and learn from incidents and near misses before similar work starts again."
        icon={AlertTriangle}
        actions={
          <Button className="shrink-0" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Report Incident
          </Button>
        }
      />

      <IncidentsTable
        data={data}
        columns={columns}
        sites={sites}
        isLoading={isLoading}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        totalRecords={totalRecords}
        handleSearch={handleSearch}
        search={search}
        additionalFilters={additionalFilters}
        setAdditionalFilters={setAdditionalFilters}
      />

      <IncidentCreateModal
        open={createModalOpen}
        sites={sites}
        onClose={() => setCreateModalOpen(false)}
      />

      <IncidentDialog
        open={dialogOpen}
        incident={selected}
        sites={sites}
        role={role}
        loading={updateMutation.isPending}
        onClose={() => modalStateHandler(MODAL_TYPE.EDIT, false)}
        onSubmit={handleFormSubmit}
      />

      <IncidentDetailModal
        open={modalState.view}
        incident={detailIncident ?? selected ?? null}
        sites={sites}
        currentUserId={user?.id}
        isLoading={detailLoading}
        onClose={() => modalStateHandler(MODAL_TYPE.VIEW, false)}
      />

      <ConfirmationDialog
        open={modalState.delete}
        handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
        handleDelete={async () => {
          if (selected) await deleteMutation.mutateAsync(selected.id);
          modalStateHandler(MODAL_TYPE.DELETE, false);
        }}
        title="Archive incident?"
        description="This will remove the incident from active views but keep the safety record for audit history."
        deleteBtnText="Archive"
        loading={deleteMutation.isPending}
      />
    </Container>
  );
};

export default withPaginatedQuery(IncidentsPage, {
  queryKey: [...CACHE_KEYS.incidents.all],
  queryFn: incidentsService.getIncidents,
});
