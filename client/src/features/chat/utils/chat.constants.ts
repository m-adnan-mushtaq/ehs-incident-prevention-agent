import type { TChatMode } from "@/types/chat";

export const CHAT_SOCKET_EVENTS = {
  JOIN_CHAT_ROOM: "join_chat_room",
  CHAT_PROGRESS: "chat_progress",
  CHAT_TOOL_STATUS: "chat_tool_status",
  CHAT_FINAL: "chat_final",
  CHAT_ERROR: "chat_error",
  CHAT_MESSAGE_CREATED: "chat:message_created",
  CHAT_THINKING: "chat:thinking",
  CHAT_TOOL_START: "chat:tool_start",
  CHAT_TOOL_RESULT: "chat:tool_result",
  CHAT_TOKEN: "chat:token",
} as const;

export const CHAT_MODES: {
  value: TChatMode;
  label: string;
  description: string;
}[] = [
  {
    value: "normal_chat",
    label: "General Safety",
    description: "Search approved guidance and expert knowledge.",
  },
  {
    value: "incident_prevention",
    label: "Incident Prevention",
    description: "Prepare for a task with similar-incident context.",
  },
  {
    value: "image_check",
    label: "Image Check",
    description: "Upload a workplace image for hazard review.",
  },
];

export const CHAT_MODE_LABELS: Record<string, string> = {
  normal_chat: "General Safety",
  incident_prevention: "Incident Prevention",
  image_check: "Image Check",
};

export const CHAT_PLACEHOLDERS: Record<TChatMode, string> = {
  normal_chat: "Ask a safety question...",
  incident_prevention: "Describe the task you are about to start...",
  image_check: "Upload an image and ask what should be checked...",
};

export const CHAT_QUICK_PROMPTS: Record<TChatMode, string[]> = {
  normal_chat: [
    "What PPE is required for chemical spill cleanup?",
    "What is the lockout/tagout procedure for electrical panels?",
    "What are the confined space entry requirements?",
  ],
  incident_prevention: [
    "We are about to clean Conveyor Line 2. What should we verify?",
    "I need to inspect the hydraulic press on Line 4. What risks should I watch for?",
    "We are about to work at height near the loading dock. What should we check?",
  ],
  image_check: [
    "Is this workspace set up safely?",
    "Are there any hazards visible in this area?",
    "Check if proper PPE is being worn in this image.",
  ],
};

export const TOOL_STATUS_LABELS: Record<string, string> = {
  received: "Classifying request...",
  image_analysis_started: "Analyzing image...",
  image_analysis_completed: "Image analysis complete",
  image_upload_started: "Saving image...",
  image_upload_completed: "Image saved",
  intent_classified: "Classifying request...",
  retrieval_started: "Finding approved safety guidance...",
  retrieval_completed: "Safety guidance reviewed",
  similar_incidents_started: "Checking incident history...",
  similar_incidents_completed: "Incident history checked",
  answer_generation_started: "Preparing safety brief...",
  answer_generation_completed: "Safety brief drafted",
  saving_answer: "Saving answer...",
  completed: "Answer ready",
  failed: "Safety check could not complete",
};

export const TOOL_TIMELINE_STEPS = [
  { key: "image_analysis", label: "Image analyzed" },
  { key: "official_guidance", label: "Official guidance checked" },
  { key: "similar_incidents", label: "Similar incidents searched" },
  { key: "expert_knowledge", label: "Expert knowledge reviewed" },
  { key: "answer", label: "Answer prepared" },
] as const;

export const CHAT_ERROR_MESSAGE =
  "Could not complete this safety check. Please try again.";

export const SITE_NONE_VALUE = "__none__";
