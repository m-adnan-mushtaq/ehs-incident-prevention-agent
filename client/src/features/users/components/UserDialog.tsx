import GenericDialog from "@/components/shared/generic-dialog";
import { UserForm } from "./UserForm";
import type { IRole } from "@/types/role";
import type { ICreateUserPayload, ICurrentUser, IUpdateUserPayload } from "@/types/user";
import { MODAL_TYPE } from "@/hooks/use-modal";

type UserDialogProps = {
  open: boolean;
  modalType: (typeof MODAL_TYPE)[keyof typeof MODAL_TYPE];
  roles: IRole[];
  user?: ICurrentUser;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: ICreateUserPayload | IUpdateUserPayload) => Promise<void>;
};

export const UserDialog = ({
  open,
  modalType,
  roles,
  user,
  loading,
  onClose,
  onSubmit,
}: UserDialogProps) => {
  const isEdit = modalType === MODAL_TYPE.EDIT;

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit team member" : "Add team member"}
      description="Manage field workers, safety managers, and administrators."
    >
      <UserForm
        roles={roles}
        user={user}
        loading={loading}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </GenericDialog>
  );
};
