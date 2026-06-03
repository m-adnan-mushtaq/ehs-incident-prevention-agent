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
      <Label className="text-slate-700">{label}</Label>
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
          className="border-slate-200 bg-white text-slate-950"
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
              className="gap-1 border-slate-200 bg-slate-100 pr-1 text-slate-700"
            >
              {item}
              <button
                type="button"
                className="ml-1 rounded p-0.5 hover:bg-slate-200"
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
