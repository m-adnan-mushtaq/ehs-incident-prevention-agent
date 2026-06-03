import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { IRole } from "@/services/governance/role.service";
import { useState } from "react";
import { useRoleColumns } from "../components/roles/columnDef";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/shared/data-table";
import GenericDialog from "@/components/shared/generic-dialog";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import {
  useCreateNewRole,
  useDeleteRoleById,
  useGetAllRoles,
  useUpdateRoleById,
} from "../queries";
import ErrorMsg from "@/components/shared/error-msg";
import { showMutationError } from "@/helpers/common";
import toast from "react-hot-toast";
import RolesForm from "../components/roles/role-form";

const RolesPage = () => {
  //api calls
  const { data, isLoading, isError } = useGetAllRoles();
  const { mutateAsync: createNew } = useCreateNewRole();
  const { mutateAsync: updateById } = useUpdateRoleById();
  const { mutateAsync: deleteById } = useDeleteRoleById();
  //modal
  const { modalState, modalStateHandler } = useModal();
  const [selectedRow, setSelectedRow] = useState<IRole>();
  const { columns } = useRoleColumns({
    handleEdit(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.EDIT, true);
    },
    handleDelete(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
  });

  const handleDelete = async () => {
    try {
      if (!selectedRow?.id) return;
      await deleteById(selectedRow.id);
      modalStateHandler(MODAL_TYPE.DELETE, false);
      toast.success("Role deleted successfully");
    } catch (error) {
      showMutationError(error);
    }
  };

  if (isError) {
    return (
      <Container>
        <ErrorMsg />
      </Container>
    );
  }

  const records = data?.data || [];

  return (
    <>
      <Container>
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-2xl">Roles Management</h2>
          <Button onClick={() => modalStateHandler(MODAL_TYPE.CREATE, true)}>
            <Plus /> New Role
          </Button>
        </div>
        <DataTable
          columns={columns as any}
          data={records}
          total={records.length}
          visiblePagination={false}
          skipSorting
          loading={isLoading}
          emptyPlaceholder="No roles found"
        />
      </Container>

      <GenericDialog
        title="Add New Role"
        description="Add a new role to the system"
        open={modalState.create}
        onClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
      >
        <RolesForm
          handleClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
          handleSubmit={async (payload) => {
            await createNew(payload);
          }}
        />
      </GenericDialog>

      {!!selectedRow && (
        <>
          <GenericDialog
            title="Update Role"
            description="Update role details"
            open={modalState.edit}
            onClose={() => modalStateHandler(MODAL_TYPE.EDIT, false)}
          >
            <RolesForm
              type="update"
              defaultValues={selectedRow}
              handleClose={() => modalStateHandler(MODAL_TYPE.EDIT, false)}
              handleSubmit={async (payload) => {
                await updateById({
                  id: selectedRow.id,
                  payload,
                });
              }}
            />
          </GenericDialog>
          <ConfirmationDialog
            title="Delete Role"
            description="Are you sure you want to delete this role?"
            open={modalState.delete}
            handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
            handleDelete={handleDelete}
          />
        </>
      )}
    </>
  );
};

export default RolesPage;
