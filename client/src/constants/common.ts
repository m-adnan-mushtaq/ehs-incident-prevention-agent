export const SVG_SECONDARY = "#94a3b8";
export const TOKEN_PREFIX = "access_token";

export const CACHE_KEYS = {
  auth: {
    me: ["auth", "me"] as const,
  },
  roles: {
    all: ["roles"] as const,
  },
  users: {
    all: ["users"] as const,
    paginated: (params: unknown) => ["users", "paginated", params] as const,
  },
  sites: {
    all: ["sites"] as const,
    listAll: ["sites", "all"] as const,
    paginated: (params: unknown) => ["sites", "paginated", params] as const,
  },
  documents: {
    all: ["documents"] as const,
    paginated: (params: unknown) => ["documents", "paginated", params] as const,
  },
  knowledgeObjects: {
    all: ["knowledge-objects"] as const,
    paginated: (params: unknown) =>
      ["knowledge-objects", "paginated", params] as const,
    detail: (id: string) => ["knowledge-objects", "detail", id] as const,
  },
  voiceKnowledge: {
    all: ["voice-knowledge"] as const,
    paginated: (params: unknown) => ["voice-knowledge", "paginated", params] as const,
  },
  incidents: {
    all: ["incidents"] as const,
    paginated: (params: unknown) => ["incidents", "paginated", params] as const,
    detail: (id: string) => ["incidents", "detail", id] as const,
  },
  chat: {
    sessions: ["chat", "sessions"] as const,
    session: (id: string) => ["chat", "session", id] as const,
    messages: (sessionId: string) => ["chat", "messages", sessionId] as const,
  },
};

export const BACKEND_URL = import.meta.env.VITE_API_URL;
export const MEDIA_BASE_URL =
  import.meta.env.VITE_MEDIA_BASE_URL || import.meta.env.VITE_API_URL;
