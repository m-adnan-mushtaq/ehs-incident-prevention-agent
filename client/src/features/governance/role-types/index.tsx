import Container from "@/components/layout/container";
import GenericDialog from "@/components/shared/generic-dialog";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/shared/data-table";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import {
  useCreateRoleType,
  useDeleteRoleType,
  useGetAllRoleTypes,
  useUpdateRoleType,
} from "../queries";
import ErrorMsg from "@/components/shared/error-msg";
import { useRoleTypeColumns } from "../components/role-type/column-def";
import { IRoleType } from "@/services/governance/role.service";
import RoleTypeForm from "../components/role-type/role-type-form";
import { showMutationError } from "@/helpers/common";
import toast from "react-hot-toast";

const RoleTypePage = () => {
  //api calls
  const { data, isLoading, isError } = useGetAllRoleTypes();
  const { mutateAsync: createNew } = useCreateRoleType();
  const { mutateAsync: updateById } = useUpdateRoleType();
  const { mutateAsync: deleteById } = useDeleteRoleType();
  //modal
  const { modalState, modalStateHandler } = useModal();
  const [selectedRow, setSelectedRow] = useState<IRoleType>();
  //columns
  const { columns } = useRoleTypeColumns({
    handleEdit(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.EDIT, true);
    },
    handleDelete(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
  });

  const roleTypes = data?.data || [];

  //event handlers
  const handleDelete = async () => {
    try {
      if (!selectedRow?.id) return;
      await deleteById(selectedRow.id);
      modalStateHandler(MODAL_TYPE.DELETE, false);
      toast.success("Role Type deleted successfully");
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

  return (
    <>
      <Container>
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-2xl">Role Types</h2>
          <Button
            size={"lg"}
            onClick={() => modalStateHandler(MODAL_TYPE.CREATE, true)}
          >
            <Plus /> New Role Type
          </Button>
        </div>
        <DataTable
          columns={columns as any}
          data={roleTypes || []}
          total={roleTypes.length}
          visiblePagination={false}
          skipSorting
          loading={isLoading}
          emptyPlaceholder="No Role Types found, please add one"
        />
      </Container>

      <GenericDialog
        title="Add New Role Type"
        open={modalState.create}
        onClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
      >
        <RoleTypeForm
          handleClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
          handleSubmit={async (payload) => {
            await createNew(payload);
          }}
        />
      </GenericDialog>

      {!!selectedRow && (
        <>
          <GenericDialog
            title="Update Role Type"
            open={modalState.edit}
            onClose={() => modalStateHandler(MODAL_TYPE.EDIT, false)}
          >
            <RoleTypeForm
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
            open={modalState.delete}
            deleteVariant={"destructive"}
            deleteBtnText="Confirm"
            handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
            handleDelete={handleDelete}
          />
        </>
      )}
    </>
  );
};

export default RoleTypePage;
