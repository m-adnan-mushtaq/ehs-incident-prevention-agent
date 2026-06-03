import { Button } from "../ui/button";
import GenericDialog from "./generic-dialog";

const ConfirmationDialog = ({
  open,
  handleClose,
  loading,
  handleDelete,
  deleteVariant = "destructive",
  title = "Are you absolutely sure?",
  description,
  deleteBtnText = "Confirm",
}: {
  loading?: boolean;
  title?: string;
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void | Promise<void>;
  description?: string;
  deleteVariant?: IButtonVariant;
  deleteBtnText?: string;
}) => {
  return (
    <GenericDialog
      title={title}
      description={description}
      open={open}
      onClose={handleClose}
    >
      <div className="min-w-96"></div>
      <div className="flex justify-end items-center gap-4">
        <Button disabled={loading} onClick={handleClose} variant="ghost">
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={handleDelete}
          variant={deleteVariant}
        >
          {loading ? "Loading..." : deleteBtnText}
        </Button>
      </div>
    </GenericDialog>
  );
};

export default ConfirmationDialog;
