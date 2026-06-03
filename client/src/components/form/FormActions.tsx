import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Loader from "../layout/loader";

type DialogActionButton = {
  label: string;
  onClick: () => void;
  visible?: boolean;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "link"
    | "icon"
    | "outline"
    | "ghost";
};

type Props = {
  loading?: boolean;
  position?: "left" | "center" | "right";
  actions?: {
    save?: DialogActionButton;
    cancel?: DialogActionButton;
  };
};
const FormActions = ({ actions, position = "right", loading }: Props) => {
  return (
    <div
      className={cn(
        "flex gap-4 mr-1",
        position === "center"
          ? "justify-center"
          : position === "right"
          ? "justify-end"
          : "justify-start"
      )}
    >
      {actions?.cancel?.visible && (
        <Button
          type="button"
          className={`px-4 py-2 rounded`}
          variant={actions.cancel.variant as any}
          onClick={actions.cancel.onClick}
          disabled={loading}
        >
          {actions.cancel.label}
        </Button>
      )}
      {actions?.save?.visible && (
        <Button
          disabled={loading}
          className={`px-4 py-2 rounded !text-white`}
          variant={actions.save.variant as any}
          onClick={actions.save.onClick}
        >
          {loading ? <Loader className="w-4 h-4 mr-2 fill-inherit" /> : null}
          {actions.save.label}
        </Button>
      )}
    </div>
  );
};

export default FormActions;
