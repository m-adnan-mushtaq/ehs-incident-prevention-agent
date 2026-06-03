export const AUTH = {
  BASE: "/auth",
  login: () => `${AUTH.BASE}/login`,
  signup: () => `${AUTH.BASE}/signup`,
  forgotPassword: () => `${AUTH.BASE}/forgot-password`,
  resetPassword: () => `${AUTH.BASE}/reset-password`,
};

export const USERS = {
  BASE: "/users",
  me: () => `${USERS.BASE}/me`,
  list: () => `${USERS.BASE}/`,
  create: () => `${USERS.BASE}/`,
  byId: (id: string) => `${USERS.BASE}/${id}`,
  suspend: (id: string) => `${USERS.BASE}/${id}/suspend`,
  activate: (id: string) => `${USERS.BASE}/${id}/activate`,
};

export const ROLES = {
  BASE: "/roles",
  list: () => `${ROLES.BASE}/`,
};

export const SITES = {
  BASE: "/sites",
  list: () => `${SITES.BASE}/`,
  all: () => `${SITES.BASE}/all`,
  byId: (id: string) => `${SITES.BASE}/${id}`,
};

export const DOCUMENTS = {
  BASE: "/documents",
  list: () => `${DOCUMENTS.BASE}/`,
  byId: (id: string) => `${DOCUMENTS.BASE}/${id}`,
};

export const KNOWLEDGE = {
  BASE: "/knowledge",
  extractVoice: () => `${KNOWLEDGE.BASE}/extract/voice`,
  list: () => `${KNOWLEDGE.BASE}/`,
  byId: (id: string) => `${KNOWLEDGE.BASE}/${id}`,
};

export const INCIDENTS = {
  BASE: "/incidents",
  list: () => `${INCIDENTS.BASE}/`,
  byId: (id: string) => `${INCIDENTS.BASE}/${id}`,
  status: (id: string) => `${INCIDENTS.BASE}/${id}/status`,
  extractVoice: () => `${INCIDENTS.BASE}/extract/voice`,
};

export const CHAT = {
  BASE: "/chat",
  sessions: () => `${CHAT.BASE}/sessions`,
  sessionById: (id: string) => `${CHAT.BASE}/sessions/${id}`,
  messages: (sessionId: string) => `${CHAT.BASE}/sessions/${sessionId}/messages`,
};
