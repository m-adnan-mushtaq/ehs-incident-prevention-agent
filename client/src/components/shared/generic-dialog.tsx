import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type GenericDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  loading?: boolean;
};

const GenericDialog = ({
  open,
  onClose,
  title = "Default Title",
  description,
  children,
}: GenericDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="mt-4 flex-1 md:min-w-max overflow-auto max-h-[80vh]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenericDialog;
