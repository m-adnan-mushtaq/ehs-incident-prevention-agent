import Container from "@/components/layout/container";
import DataTable from "@/components/shared/data-table";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { PageHeader, SectionCard } from "@/components/shared/safety-ui";
import withPaginatedQuery, {
  PaginationWrapperProps,
} from "@/components/hoc/withPaginatedQuery";
import { CACHE_KEYS } from "@/constants/common";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { authService, rolesService } from "@/services";
import type { ICurrentUser } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useColumns } from "./hooks/useColumns";
import { UserDialog } from "./components/UserDialog";
import { useCreateUser } from "./hooks/useCreateUser";
import { useUpdateUser } from "./hooks/useUpdateUser";
import { useDeleteUser } from "./hooks/useDeleteUser";

const UsersPage = ({
  data,
  paginationModel,
  isLoading,
  setSortModel,
  sortModel,
  setPaginationModel,
  totalRecords,
  handleSearch,
  search,
}: PaginationWrapperProps<ICurrentUser>) => {
  const { modalState, modalStateHandler } = useModal();
  const [selectedUser, setSelectedUser] = useState<ICurrentUser>();
  const { data: roles = [] } = useQuery({
    queryKey: CACHE_KEYS.roles.all,
    queryFn: rolesService.getRoles,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const { columns } = useColumns({
    handleEdit: (user) => {
      setSelectedUser(user);
      modalStateHandler(MODAL_TYPE.EDIT, true);
    },
    handleDelete: (user) => {
      setSelectedUser(user);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
  });

  const dialogOpen = modalState.create || modalState.edit;
  const dialogType = modalState.edit ? MODAL_TYPE.EDIT : MODAL_TYPE.CREATE;

  return (
    <Container className="pb-10 text-slate-900">
      <PageHeader
        eyebrow="People and roles"
        title="Field Teams"
        description="Manage administrators, safety managers, SMEs, and field workers who use Safety Operations AI."
        icon={Users}
        actions={
          <Button
            onClick={() => {
              setSelectedUser(undefined);
              modalStateHandler(MODAL_TYPE.CREATE, true);
            }}
          >
            <Plus className="h-4 w-4" /> Add user
          </Button>
        }
      />
      <SectionCard
        title="Team directory"
        description="Role, status, and access controls for the current tenant."
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
          emptyPlaceholder="No users found. Add team members to begin."
          search={search}
          onSearch={handleSearch}
        />
      </SectionCard>
      <UserDialog
        open={dialogOpen}
        modalType={dialogType}
        roles={roles}
        user={selectedUser}
        loading={createMutation.isPending || updateMutation.isPending}
        onClose={() => {
          modalStateHandler(MODAL_TYPE.CREATE, false);
          modalStateHandler(MODAL_TYPE.EDIT, false);
        }}
        onSubmit={async (values) => {
          if (selectedUser && "role" in values) {
            await updateMutation.mutateAsync({
              id: selectedUser.id,
              payload: values,
            });
          } else {
            await createMutation.mutateAsync(values as Parameters<
              typeof createMutation.mutateAsync
            >[0]);
          }
        }}
      />
      <ConfirmationDialog
        open={modalState.delete}
        handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
        handleDelete={async () => {
          if (selectedUser) await deleteMutation.mutateAsync(selectedUser.id);
          modalStateHandler(MODAL_TYPE.DELETE, false);
        }}
        title="Remove this user from the organization?"
        loading={deleteMutation.isPending}
      />
    </Container>
  );
};

export default withPaginatedQuery(UsersPage, {
  queryKey: [...CACHE_KEYS.users.all],
  queryFn: authService.getPaginatedUsers,
});
