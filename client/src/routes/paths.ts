export const ROUTE_PATHS = {
  root: "/",
  auth: {
    root: "/auth",
    login: "/auth/login",
    adminSignup: "/auth/admin-signup",
  },
  app: {
    root: "/app",
    users: "/app/users",
    sites: "/app/sites",
    documents: "/app/documents",
    voiceKnowledge: "/app/voice-knowledge",
    incidents: "/app/incidents",
    chat: "/app/chat",
    chatSession: "/app/chat/$sessionId",
  },
} as const;

export type AppRoutePath =
  (typeof ROUTE_PATHS.app)[keyof typeof ROUTE_PATHS.app];

export type AuthRoutePath =
  (typeof ROUTE_PATHS.auth)[keyof typeof ROUTE_PATHS.auth];
