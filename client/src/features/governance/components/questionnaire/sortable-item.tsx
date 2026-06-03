import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormBuilderStore } from "@/store/form-builder";
import { FormField } from "../../types/form-builder";
import {
  formTypeIconColors,
  INPUT_TYPES_TYPE,
  inputTypeOptions,
} from "@/constants/form-builder";
import { toTitleCase } from "@/helpers/common";

type Props = {
  item: FormField;
};

const SortableItem = ({ item }: Props) => {
  //store hooks
  const updateQuestion = useFormBuilderStore((store) => store.updateQuestion);
  const deleteQuestion = useFormBuilderStore(
    (store) => store.handleDeleteQuestion
  );
  const [editMode, setEditMode] = useState<boolean>(false);

  //Subscribe to formJson to get the latest form state
  useFormBuilderStore((store) => store.formJson);
  const setActiveQuestion = useFormBuilderStore(
    (store) => store.setActiveQuestionId
  );
  const setActiveStepId = useFormBuilderStore((store) => store.setActiveStepId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      stepId: item.stepId,
      label: item.label,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "flex items-center border border-primary-light rounded-b-md p-2 bg-white"
        )}
      >
        <button
          className="mr-2 cursor-grab touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-gray-500" />
        </button>
        <div className="grid  md:grid-cols-2 xl:grid-cols-4 items-center cursor-pointer w-full">
          <span className="flex-1 cursor-pointer xl:col-span-3 relative">
            <Input
              className={cn(
                "bg-white border-1 border-transparent focus:border-primary/30 shadow-none !ring-0 rounded-sm",
                {
                  "!border-primary": editMode,
                }
              )}
              defaultValue={item.label}
              onBlur={(e) => {
                updateQuestion(
                  { label: e.target.value, id: item.id },
                  item.stepId
                );
                setEditMode(false);
              }}
              onFocus={() => {
                setActiveQuestion?.(item.id);
                setActiveStepId?.(item.stepId);
                setEditMode(true);
              }}
              key={item.label}
            />
            {item.required && (
              <span className="text-destructive absolute top-0 left-1">*</span>
            )}

            {editMode && (
              <>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full" />
              </>
            )}
          </span>
          <div className="flex col-span-1 items-center justify-between">
            <Select
              value={item.type}
              onValueChange={(value) => {
                const newType = value as INPUT_TYPES_TYPE;
                updateQuestion(
                  {
                    type: newType,
                    id: item.id,
                  },
                  item.stepId
                );
              }}
              onOpenChange={(open) => {
                if (!open) {
                  setActiveQuestion?.(item.id);
                  setActiveStepId?.(item.stepId);
                }
              }}
            >
              <SelectTrigger className="!outline-none flex-1 !ring-0 border-0 shadow-none">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(inputTypeOptions).map(([key, value]) => (
                  <SelectGroup key={key}>
                    <SelectLabel className="text-gray-500 my-1">
                      {toTitleCase(key.replace(/([A-Z])/g, " $1"))}
                    </SelectLabel>
                    {value.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.Icon
                            className={cn(
                              "size-4",
                              formTypeIconColors[option.value]
                            )}
                          />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => deleteQuestion(item.id, item.stepId)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SortableItem);
