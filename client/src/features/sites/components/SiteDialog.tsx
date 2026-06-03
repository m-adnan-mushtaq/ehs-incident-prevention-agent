import GenericDialog from "@/components/shared/generic-dialog";
import { SiteForm } from "./SiteForm";
import type { ICreateSitePayload, ISite, IUpdateSitePayload } from "@/types/site";

type SiteDialogProps = {
  open: boolean;
  site?: ISite;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: ICreateSitePayload | IUpdateSitePayload) => Promise<void>;
};

export const SiteDialog = ({
  open,
  site,
  loading,
  onClose,
  onSubmit,
}: SiteDialogProps) => (
  <GenericDialog
    open={open}
    onClose={onClose}
    title={site ? "Edit site" : "Add site"}
    description="Manage operational sites for your safety program."
  >
    <SiteForm site={site} loading={loading} onSubmit={onSubmit} onClose={onClose} />
  </GenericDialog>
);
