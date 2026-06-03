import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, Send } from "lucide-react";
import { useCallback, useRef } from "react";
import { ChatImagePreview } from "./ChatImagePreview";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  disabled?: boolean;
  sending?: boolean;
  imageFile: File | null;
  imagePreview: string | null;
  onImageSelect: (file: File | null) => void;
};

export const ChatInput = ({
  value,
  onChange,
  onSend,
  placeholder,
  disabled,
  sending,
  imageFile,
  imagePreview,
  onImageSelect,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !sending && (value.trim() || imageFile)) onSend();
    }
  };

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onImageSelect(file);
      e.target.value = "";
    },
    [onImageSelect]
  );

  const canSend = Boolean(value.trim() || imageFile) && !disabled && !sending;

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white shadow-[0_-2px_10px_rgba(15,23,42,0.06)]">
      <div className="mx-auto w-full max-w-3xl p-3 md:p-4">
        {imagePreview && imageFile && (
          <div className="mb-3">
            <ChatImagePreview
              previewUrl={imagePreview}
              fileName={imageFile.name}
              onRemove={() => onImageSelect(null)}
            />
          </div>
        )}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-1.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-hidden
            onChange={onFileChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-slate-600 hover:bg-white hover:text-blue-700"
            disabled={disabled || sending}
            onClick={() => fileRef.current?.click()}
            aria-label="Upload safety image"
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            aria-label="Safety assistant message"
            className="min-h-9 max-h-32 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm leading-5 shadow-none focus-visible:ring-0"
            rows={1}
          />
          <Button
            type="button"
            size="icon"
            className="h-9 w-9 shrink-0 bg-blue-600 hover:bg-blue-700"
            disabled={!canSend}
            onClick={onSend}
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
