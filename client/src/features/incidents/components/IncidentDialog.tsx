import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IIncident } from "@/types/incident";
import type { ISite } from "@/types/site";
import type { UserRole } from "@/types/user";
import { IncidentForm } from "./IncidentForm";
import type { IIncidentFormValues } from "../utils/incident-formatters";

type Props = {
  open: boolean;
  incident?: IIncident;
  sites: ISite[];
  role: UserRole | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: IIncidentFormValues) => Promise<void>;
};

export const IncidentDialog = ({
  open,
  incident,
  sites,
  role,
  loading,
  onClose,
  onSubmit,
}: Props) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-slate-200 bg-white text-slate-950">
      <DialogHeader>
        <DialogTitle>
          {incident ? "Edit incident" : "Report incident"}
        </DialogTitle>
        <DialogDescription className="text-slate-500">
          {incident
            ? "Update safety event details for review and prevention learning."
            : "Record a safety event, near miss, or unsafe condition so it can be reviewed and reused for future prevention."}
        </DialogDescription>
      </DialogHeader>
      <IncidentForm
        key={incident?.id ?? "create"}
        incident={incident}
        sites={sites}
        role={role}
        loading={loading}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </DialogContent>
  </Dialog>
);
