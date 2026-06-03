import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Collapsible } from "@/components/ui/collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  ChevronRight,
  CircleHelp,
  File,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import SortableItem from "./sortable-item";
import { useFormBuilderStore } from "@/store/form-builder";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { FormField, FormStep } from "../../types/form-builder";

type GroupProps = {
  stepFields: FormField[];
};

const DndQuestionsGroup = ({ stepFields }: GroupProps) => {
  return (
    <>
      <SortableContext
        items={stepFields.map((field) => field.id)}
        strategy={verticalListSortingStrategy}
      >
        {stepFields.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </SortableContext>
    </>
  );
};

type ListProps = {
  step: FormStep;
  isExpanded: boolean;
  onExpand: () => void;
  handleAddStep: () => void;
  handleDeleteStep?: () => void;
  handleAddQuestion: () => void;
};

const addOptions = [
  {
    Icon: <CircleHelp className="mt-1" />,
    title: "Question",
    caption: "Select a type of question to capture information.",
    value: "question",
  },
  {
    Icon: <File className="mt-1" />,
    title: "Page",
    caption: "Add a new page to your form.",
    value: "page",
  },
];

const SortableFormInputList = ({
  step,
  isExpanded,
  onExpand,
  handleAddStep,
  handleDeleteStep,
  handleAddQuestion,
}: ListProps) => {
  const handleUpdateStep = useFormBuilderStore(
    (store) => store.handleUpdateStep
  );

  const [editMode, setEditMode] = useState<boolean>(false);

  return (
    <>
      <Collapsible open={isExpanded} onOpenChange={onExpand}>
        <div className="flex items-center gap-0 mb-4">
          <CollapsibleTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <ChevronRight
                className={cn("transition-all duration-300", {
                  "rotate-90": isExpanded,
                })}
              />
            </Button>
          </CollapsibleTrigger>
          {editMode ? (
            <Input
              className="max-w-sm !ring-primary/30 bg-white"
              onBlur={() => setEditMode(false)}
              value={step.title}
              onChange={(e) => {
                handleUpdateStep({ title: e.target.value, id: step.id });
              }}
            />
          ) : (
            <span className="flex items-center gap-2 text-lg font-semibold">
              {step.title}
              <Button
                onClick={() => setEditMode(!editMode)}
                size={"icon"}
                variant={"ghost"}
              >
                <Pencil />
              </Button>
            </span>
          )}

          {typeof handleDeleteStep === "function" && (
            <Button onClick={handleDeleteStep} variant={"ghost"} size={"icon"}>
              <Trash2 className="text-destructive" />
            </Button>
          )}
        </div>
        <CollapsibleContent className="p-2 space-y-4 w-full max-w-screen-xl">
          <p className="text-slateText text-sm">
            This is where you add your questions and how you want them answered.
          </p>
          <div>
            <div className="grid  md:grid-cols-2 xl:grid-cols-4 gap-2 px-2 font-semibold text-sm items-center bg-white border rounded-t-md">
              <p className="xl:col-span-3 text-primary  p-2">Question</p>
              <p className="col-span-1 text-secondaryText border-l p-2">
                Response Type
              </p>
            </div>
            <DndQuestionsGroup stepFields={step.fields} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="text-primary" variant={"outline"}>
                <Plus /> Add new
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64">
              {addOptions.map((option) => (
                <DropdownMenuItem
                  className="flex items-start gap-2 cursor-pointer"
                  key={option.value}
                  onClick={() => {
                    if (option.value === "question") {
                      handleAddQuestion();
                    }
                    if (option.value === "page") {
                      handleAddStep();
                    }
                  }}
                >
                  {option.Icon}
                  <div className="space-y-1">
                    <span className="text-base font-semibold">
                      {option.title}
                    </span>
                    <p className="text-xs text-slateText">{option.caption}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

const FormCanvas = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    expandedSteps,
    handleExpandStep,
    handleAddStep,
    handleAddQuestion,
    handleDeleteStep,
    activeStepId,
    setActiveStepId,
    formJson,
    handleReorder,
    setSelectedField,
    selectedField,
  } = useFormBuilderStore();

  const { modalState, modalStateHandler } = useModal();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const activeStepId = selectedField?.stepId;

    handleReorder(
      active.id as string,
      over.id as string,
      activeStepId as string
    );

    setSelectedField(undefined);
  };

  const handleDragStart = (event: DragStartEvent) => {
    // complete this
    const selectedField = event.active?.data.current;
    setSelectedField(selectedField as any);
  };

  const handleClickDelete = (step: FormStep) => {
    setActiveStepId(step.id);
    modalStateHandler(MODAL_TYPE.DELETE, true);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        {formJson?.steps?.map((step, index) => (
          <SortableFormInputList
            key={step.id}
            step={step}
            isExpanded={expandedSteps[step.id]}
            onExpand={() => handleExpandStep(step.id)}
            handleAddStep={() => {
              handleAddStep(index);
            }}
            handleDeleteStep={
              index > 0 ? () => handleClickDelete(step) : undefined
            }
            handleAddQuestion={() => handleAddQuestion(step.id)}
          />
        ))}

        <DragOverlay>
          {selectedField ? (
            <div className="w-full border border-gray-200 bg-white shadow-md rounded-md">
              <div className="flex items-center p-3">
                <GripVertical className="h-4 w-4 text-gray-500 mr-2" />
                <span>{selectedField?.label}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {!!activeStepId && (
        <ConfirmationDialog
          open={modalState.delete}
          handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
          handleDelete={() => {
            handleDeleteStep();
            modalStateHandler(MODAL_TYPE.DELETE, false);
          }}
          title="Delete Step"
          description="Are you sure you want to delete this step? This action cannot be undone."
        />
      )}
    </>
  );
};

export default FormCanvas;
