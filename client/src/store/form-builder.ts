import { create } from "zustand";
import {
  FormDefinition,
  FormField,
  FormStep,
} from "@/features/governance/types/form-builder";
import { INPUT_TYPES } from "@/constants/form-builder";
import { arrayMove } from "@dnd-kit/sortable";

const DEFAULT_FORM_BUILDER_CONFIG: FormDefinition = {
  title: "Form Title",
  steps: [
    {
      id: "step1",
      title: "Step 1",
      fields: [],
    },
  ],
};

type FormBuilderState = {
  formJson: FormDefinition;
  selectedField?: {
    label: string;
    id: string;
    stepId: string;
  };
  activeStepId?: string;
  activeQuestionId?: string;
  expandedSteps: Record<string, boolean>;
  editConfiguration: Record<string, boolean>;
  selectedTemplateId?: number;
};

type FormBuilderActions = {
  setFormJson: (form: FormDefinition) => void;
  setSelectedField: (field: FormBuilderState["selectedField"]) => void;
  setActiveStepId: (id: string | undefined) => void;
  setActiveQuestionId: (field: string | undefined) => void;

  updateQuestion: (
    question: Partial<FormField> & { id: string },
    stepId: string
  ) => void;
  handleUpdateStep: (step: Partial<FormStep> & { id: string }) => void;
  handleAddStep: (currentStepIndex: number) => void;
  handleDeleteStep: () => void;
  handleAddQuestion: (stepId: string, parentId?: string) => void;
  handleReorder: (activeId: string, overId: string, stepId: string) => void;
  handleExpandStep: (stepId: string) => void;
  handleDeleteQuestion: (questionId: string, stepId: string) => void;
  handleEditConfiguration: (id: string) => void;
  resetEditConfiguration: () => void;
  updateFormJson: (newJson: any) => void;
  resetFormJson: () => void;
  updateSelectedTemplateId: (id: number | undefined) => void;
  getActiveQuestion: () => FormField | undefined;
};

const defaultState: FormBuilderState = {
  formJson: DEFAULT_FORM_BUILDER_CONFIG,
  selectedField: undefined,
  activeStepId: undefined,
  activeQuestionId: undefined,
  expandedSteps: {},
  editConfiguration: {},
};

export const useFormBuilderStore = create<
  FormBuilderState & FormBuilderActions
>((set, get) => ({
  ...defaultState,
  setFormJson: (formJson) => set({ formJson }),
  setSelectedField: (field) => set({ selectedField: field }),
  setActiveStepId: (id) => set({ activeStepId: id }),
  setActiveQuestionId: (id) => set({ activeQuestionId: id }),
  resetFormJson: () =>
    set({
      ...defaultState,
    }),

  updateQuestion: (question, stepId) => {
    const newJson = structuredClone(get().formJson);
    newJson.steps = newJson.steps.map((step) => {
      if (step.id === stepId) {
        step.fields = step.fields.map((field) => {
          if (field.id === question.id) {
            const merged = { ...field, ...question };
            return merged;
          }
          return field;
        });
      }
      return step;
    });

    set({ formJson: newJson });
  },

  handleUpdateStep: (step) => {
    const newJson = structuredClone(get().formJson);
    newJson.steps = newJson.steps.map((s) =>
      s.id === step.id ? { ...s, ...step } : s
    );
    set({ formJson: newJson });
  },

  handleAddStep: (index) => {
    const newStep: FormStep = {
      id: crypto.randomUUID(),
      title: "New Step",
      fields: [],
    };

    const newJson = structuredClone(get().formJson);
    newJson.steps.splice(index + 1, 0, newStep);
    set({ formJson: newJson });
  },

  handleDeleteStep: () => {
    const { activeStepId, formJson } = get();
    if (!activeStepId) return;

    const newJson = {
      ...formJson,
      steps: formJson.steps.filter((s) => s.id !== activeStepId),
    };

    set({ formJson: newJson, activeStepId: undefined });
  },

  handleAddQuestion: (stepId) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      stepId,
      type: INPUT_TYPES.TEXTFIELD,
      label: `New Question ${Math.floor(Math.random() * 100)}`,
      required: false,
      placeholder: "Enter your answer",
      description: "",
    };

    const newJson = structuredClone(get().formJson);
    newJson.steps = newJson.steps.map((step) => {
      if (step.id === stepId) {
        step.fields.push(newField);
      }
      return step;
    });

    set({ formJson: newJson });
  },

  handleReorder: (activeId, overId, stepId) => {
    const newJson = structuredClone(get().formJson);
    newJson.steps = newJson.steps.map((step) => {
      if (step.id === stepId) {
        const oldIndex = step.fields.findIndex((f) => f.id === activeId);
        const newIndex = step.fields.findIndex((f) => f.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          step.fields = arrayMove(step.fields, oldIndex, newIndex);
        }
      }
      return step;
    });

    set({ formJson: newJson });
  },
  handleExpandStep(stepId) {
    const expandedSteps = get().expandedSteps;
    const isExpanded = expandedSteps[stepId] || false;
    set({
      expandedSteps: {
        ...expandedSteps,
        [stepId]: !isExpanded,
      },
    });
  },
  handleDeleteQuestion: (questionId, stepId) => {
    const newJson = structuredClone(get().formJson);
    const activeQuestionId = get().activeQuestionId;
    newJson.steps = newJson.steps.map((step) => {
      if (step.id === stepId) {
        step.fields = step.fields.filter((field) => field.id !== questionId);
      }
      return step;
    });

    if (activeQuestionId === questionId) {
      set({ activeQuestionId: undefined });
    }

    set({ formJson: newJson });
  },
  handleEditConfiguration(id) {
    set({
      editConfiguration: {
        [id]: true,
      },
    });
  },
  resetEditConfiguration() {
    set({
      editConfiguration: {},
    });
  },
  updateFormJson: (newJson) => {
    const prevJson = structuredClone(get().formJson);
    const mergedJson = { ...prevJson, ...newJson };
    set({ formJson: mergedJson });
  },
  updateSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  getActiveQuestion: () => {
    const { activeStepId, activeQuestionId } = get();
    if (!activeStepId || !activeQuestionId) return;
    const step = get().formJson.steps.find((s) => s.id === activeStepId);
    if (!step) return;
    return step.fields.find((f) => f.id === activeQuestionId);
  },
}));
