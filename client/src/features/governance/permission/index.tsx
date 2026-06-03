import { useState } from "react";
import {
  useCreateNewPermission,
  useDeletePermissionById,
  useGetAllPermissions,
  useUpdatePermissionById,
} from "../queries";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { IPermission } from "@/services/governance/permission.service";
import { usePermissionColumns } from "../components/permission/column-def";
import toast from "react-hot-toast";
import { showMutationError } from "@/helpers/common";
import Container from "@/components/layout/container";
import ErrorMsg from "@/components/shared/error-msg";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/shared/data-table";
import GenericDialog from "@/components/shared/generic-dialog";
import PermissionForm from "../components/permission/permission-form";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";

const PermissionsPage = () => {
  //api calls
  const { data, isLoading, isError } = useGetAllPermissions();
  const { mutateAsync: createNew } = useCreateNewPermission();
  const { mutateAsync: updateById } = useUpdatePermissionById();
  const { mutateAsync: deleteById } = useDeletePermissionById();
  //modal
  const { modalState, modalStateHandler } = useModal();
  const [selectedRow, setSelectedRow] = useState<IPermission>();
  //columns
  const { columns } = usePermissionColumns({
    handleEdit(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.EDIT, true);
    },
    handleDelete(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
  });

  const records = data?.data || [];

  //event handlers
  const handleDelete = async () => {
    try {
      if (!selectedRow?.id) return;
      await deleteById(selectedRow.id);
      modalStateHandler(MODAL_TYPE.DELETE, false);
      toast.success("Permission deleted successfully");
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
          <h2 className="text-lg md:text-2xl">Manage Permissions</h2>
          <Button
            size={"lg"}
            onClick={() => modalStateHandler(MODAL_TYPE.CREATE, true)}
          >
            <Plus /> Permission
          </Button>
        </div>
        <DataTable
          columns={columns as any}
          data={records || []}
          total={records.length}
          visiblePagination={false}
          skipSorting
          loading={isLoading}
          emptyPlaceholder="No records found, please add one"
        />
      </Container>

      <GenericDialog
        title="Add New Permission"
        open={modalState.create}
        onClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
      >
        <PermissionForm
          handleClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
          handleSubmit={async (payload) => {
            await createNew(payload);
          }}
        />
      </GenericDialog>

      {!!selectedRow && (
        <>
          <GenericDialog
            title="Update Permission"
            open={modalState.edit}
            onClose={() => modalStateHandler(MODAL_TYPE.EDIT, false)}
          >
            <PermissionForm
              type="update"
              defaultValues={{
                ...selectedRow,
                codename: selectedRow?.codename?.split("_")?.[0],
              }}
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

export default PermissionsPage;
