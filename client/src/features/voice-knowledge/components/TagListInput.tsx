import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const TagListInput = ({
  label,
  values,
  onChange,
  placeholder = "Add item and press Enter",
  disabled,
}: Props) => {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="border-slate-700 bg-slate-900/50 text-slate-100"
        />
        <Button type="button" variant="outline" onClick={addItem} disabled={disabled}>
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((item) => (
            <Badge
              key={item}
              variant="outline"
              className="border-slate-600 bg-slate-800/60 text-slate-200 gap-1 pr-1"
            >
              {item}
              <button
                type="button"
                className="ml-1 rounded hover:bg-slate-700 p-0.5"
                onClick={() => onChange(values.filter((v) => v !== item))}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
