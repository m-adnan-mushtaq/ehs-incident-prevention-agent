import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Props = {
  previewUrl: string;
  fileName?: string;
  onRemove: () => void;
};

export const ChatImagePreview = ({ previewUrl, fileName, onRemove }: Props) => (
  <div className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-2">
    <img
      src={previewUrl}
      alt={fileName ? `Attached: ${fileName}` : "Attached safety image"}
      className="h-16 w-16 rounded object-cover"
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs font-medium text-slate-700">
        {fileName ?? "Safety image attached"}
      </p>
      <p className="text-[10px] text-slate-500">Will be sent with your message</p>
    </div>
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="shrink-0"
      onClick={onRemove}
      aria-label="Remove attached image"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);
