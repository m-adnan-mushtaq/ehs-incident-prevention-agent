import { CACHE_KEYS } from "@/constants/common";
import { useUserColumns } from "../components/users/columndef";
import withPaginatedQuery, {
  PaginationWrapperProps,
} from "@/components/hoc/withPaginatedQuery";
import { authService } from "@/services";
import { IUser } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/shared/data-table";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { useState } from "react";
import GenericDialog from "@/components/shared/generic-dialog";
import UserForm from "../components/users/user-form";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/config/query-client";
import toast from "react-hot-toast";
import Container from "@/components/layout/container";

const UsersPage = ({
  data,
  paginationModel,
  isLoading,
  setSortModel,
  sortModel,
  setPaginationModel,
  totalRecords,
}: PaginationWrapperProps<IUser>) => {
  const { modalState, modalStateHandler } = useModal();
  const [, setSelectedUser] = useState<IUser>();
  const { columns } = useUserColumns({
    handleView: (user: IUser) => {
      setSelectedUser(user);
      modalStateHandler(MODAL_TYPE.VIEW, true);
    },
  });

  const { mutateAsync: addNewUser, isPending } = useMutation({
    mutationFn: authService.addNewUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.USER],
      });
    },
  });

  return (
    <>
      <Container>
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-2xl">Users Management</h2>
          <Button onClick={() => modalStateHandler(MODAL_TYPE.CREATE, true)}>
            <Plus /> New User
          </Button>
        </div>
        <DataTable
          columns={columns as any}
          data={data}
          total={totalRecords}
          sorting={sortModel}
          setSorting={setSortModel}
          loading={isLoading}
          pagination={paginationModel}
          setPagination={setPaginationModel}
          visiblePagination
        />
      </Container>
      <GenericDialog
        title="Add New User"
        description="Add a new user to the system"
        open={modalState.create}
        onClose={() => {
          if (isPending) return;
          modalStateHandler(MODAL_TYPE.CREATE, false);
        }}
      >
        <UserForm
          handleClose={() => {
            modalStateHandler(MODAL_TYPE.CREATE, false);
          }}
          handleSubmit={async (values) => {
            const result = await addNewUser(values);
            toast.success(result?.data?.detail || "Verification email sent");
          }}
        />
      </GenericDialog>
    </>
  );
};

export default withPaginatedQuery(UsersPage, {
  queryKey: [CACHE_KEYS.USER],
  queryFn: authService.getAllPaginatedUsers,
});
