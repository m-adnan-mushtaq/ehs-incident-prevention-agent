import Container from "@/components/layout/container";
import GenericDialog from "@/components/shared/generic-dialog";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/shared/data-table";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import {
  useCreateUserIdentity,
  useDeleteUserIdentity,
  useGetAllUserIdentity,
  useUpdateUserIdentity,
} from "../queries";
import ErrorMsg from "@/components/shared/error-msg";
import { showMutationError } from "@/helpers/common";
import toast from "react-hot-toast";
import { useUserIdentityColumns } from "../components/user-identity/columndef";
import { IUserIdentity } from "@/services/governance/user-identity.service";
import UserIdentityForm from "../components/user-identity/user-identity-form";

const UserIdentityPage = () => {
  //api calls
  const { data, isLoading, isError } = useGetAllUserIdentity();
  const { mutateAsync: createNew } = useCreateUserIdentity();
  const { mutateAsync: updateById } = useUpdateUserIdentity();
  const { mutateAsync: deleteById } = useDeleteUserIdentity();
  //modal
  const { modalState, modalStateHandler } = useModal();
  const [selectedRow, setSelectedRow] = useState<IUserIdentity>();
  //columns
  const { columns } = useUserIdentityColumns({
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
      toast.success("User Identity deleted successfully");
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
          <h2 className="text-lg md:text-2xl">User Identities</h2>
          <Button
            size={"lg"}
            onClick={() => modalStateHandler(MODAL_TYPE.CREATE, true)}
          >
            <Plus /> New User Identity
          </Button>
        </div>
        <DataTable
          columns={columns as any}
          data={roleTypes || []}
          total={roleTypes.length}
          visiblePagination={false}
          skipSorting
          loading={isLoading}
          emptyPlaceholder="No User Identities, please add one"
        />
      </Container>

      <GenericDialog
        title="Add New User Identity"
        open={modalState.create}
        onClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
      >
        <UserIdentityForm
          handleClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
          handleSubmit={async (payload) => {
            await createNew(payload);
          }}
        />
      </GenericDialog>

      {!!selectedRow && (
        <>
          <GenericDialog
            title="Update User Identity"
            open={modalState.edit}
            onClose={() => modalStateHandler(MODAL_TYPE.EDIT, false)}
          >
            <UserIdentityForm
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

export default UserIdentityPage;
