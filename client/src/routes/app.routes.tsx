import {
  EmptyState,
  PageHeader,
  SectionCard,
  StatCard,
} from "@/components/shared/safety-ui";
import { StatusBadge } from "@/components/shared/status-badge";
import { CACHE_KEYS } from "@/constants/common";
import DocumentsPage from "@/features/documents";
import SitesPage from "@/features/sites";
import UsersPage from "@/features/users";
import IncidentsPage from "@/features/incidents";
import VoiceKnowledgePage from "@/features/voice-knowledge";
import ChatPage from "@/features/chat";
import AppShellLayout from "@/layout/app-shell";
import { getUserRole } from "@/lib/user-role";
import { createRoute } from "@tanstack/react-router";
import { requireAdmin, requireAuth } from "./guards";
import { ROUTE_PATHS } from "./paths";
import { rootRoute } from "./root.route";
import {
  authService,
  chatService,
  documentsService,
  incidentsService,
  knowledgeObjectsService,
} from "@/services";
import { useAuthStore } from "@/store/auth";
import type { IIncident } from "@/types/incident";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpenCheck,
  ClipboardCheck,
  FileText,
  MessageSquareText,
  ShieldCheck,
  Users,
} from "lucide-react";

const dashboardParams = { page: 1, page_size: 6 };

const AppDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const role = getUserRole(user);
  const adminOnly = role === "admin";

  const incidentsQuery = useQuery({
    queryKey: [...CACHE_KEYS.incidents.all, "dashboard"],
    queryFn: () => incidentsService.getIncidents(dashboardParams),
  });
  const chatQuery = useQuery({
    queryKey: [...CACHE_KEYS.chat.sessions, "dashboard"],
    queryFn: chatService.getChatSessions,
  });
  const documentsQuery = useQuery({
    queryKey: [...CACHE_KEYS.documents.all, "dashboard"],
    queryFn: () => documentsService.getPaginatedDocuments({ page: 1, page_size: 50 }),
    enabled: adminOnly,
  });
  const usersQuery = useQuery({
    queryKey: [...CACHE_KEYS.users.all, "dashboard"],
    queryFn: () => authService.getPaginatedUsers({ page: 1, page_size: 1 }),
    enabled: adminOnly,
  });
  const knowledgeQuery = useQuery({
    queryKey: [...CACHE_KEYS.knowledgeObjects.all, "dashboard"],
    queryFn: () =>
      knowledgeObjectsService.getPaginatedKnowledgeObjects({
        page: 1,
        page_size: 1,
        status: "approved",
      }),
  });

  const documents = documentsQuery.data?.results ?? [];
  const incidents = incidentsQuery.data?.results ?? [];
  const highRiskIncidents = incidents.filter((incident) =>
    ["high", "critical"].includes((incident.severity ?? "").toLowerCase())
  );
  const processedDocuments = documents.filter(
    (doc) => doc.status === "processed"
  ).length;
  const failedDocuments = documents.filter((doc) => doc.status === "failed").length;
  const processingDocuments = documents.filter((doc) =>
    ["uploaded", "processing"].includes(doc.status)
  ).length;

  return (
    <div className="space-y-5 p-4 pb-10 md:p-8">
      <PageHeader
        eyebrow={user?.tenant?.name ?? "Safety Operations AI"}
        title="Safety Operations Dashboard"
        description="A command-center view of field questions, incident learning, approved documents, and knowledge base health."
        icon={ShieldCheck}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total documents"
          value={adminOnly ? documentsQuery.data?.count ?? "0" : "Admin"}
          helper={adminOnly ? "Approved source library" : "Restricted to admins"}
          icon={FileText}
          tone="blue"
        />
        <StatCard
          label="Processed documents"
          value={adminOnly ? processedDocuments : "Admin"}
          helper={adminOnly ? `${processingDocuments} in processing` : "Requires document access"}
          icon={BookOpenCheck}
          tone="green"
        />
        <StatCard
          label="Incidents / near misses"
          value={incidentsQuery.data?.count ?? "0"}
          helper={`${highRiskIncidents.length} high-risk in recent results`}
          icon={AlertTriangle}
          tone={highRiskIncidents.length ? "amber" : "slate"}
        />
        <StatCard
          label="Field questions asked"
          value={chatQuery.data?.length ?? "0"}
          helper="Safety assistant sessions"
          icon={MessageSquareText}
          tone="blue"
        />
        <StatCard
          label="Approved knowledge"
          value={knowledgeQuery.data?.count ?? "0"}
          helper="SME-reviewed objects"
          icon={ClipboardCheck}
          tone="green"
        />
        <StatCard
          label="Field team members"
          value={adminOnly ? usersQuery.data?.count ?? "0" : "Admin"}
          helper={adminOnly ? "Active workspace users" : "Restricted to admins"}
          icon={Users}
          tone="slate"
        />
        <StatCard
          label="Open conflicts"
          value="--"
          helper="No conflict summary endpoint yet"
          icon={AlertTriangle}
          tone="slate"
        />
        <StatCard
          label="Pending reviews"
          value="--"
          helper="No review queue endpoint yet"
          icon={ClipboardCheck}
          tone="slate"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Safety Intelligence Overview"
          description="Recent high-risk incidents and active prevention signals from available operational data."
        >
          {incidentsQuery.isLoading ? (
            <DashboardListSkeleton />
          ) : highRiskIncidents.length ? (
            <div className="space-y-3">
              {highRiskIncidents.map((incident) => (
                <IncidentRow key={incident.id} incident={incident} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recent high-risk incidents"
              description="Incidents and near misses with high or critical severity will surface here when available."
              icon={ShieldCheck}
            />
          )}
        </SectionCard>

        <SectionCard
          title="Knowledge Base Health"
          description="Document processing health from the existing document library."
        >
          {adminOnly ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <HealthTile label="Uploaded documents" value={documents.length} />
              <HealthTile label="Processing documents" value={processingDocuments} />
              <HealthTile label="Failed documents" value={failedDocuments} tone="red" />
              <HealthTile label="Processed documents" value={processedDocuments} tone="green" />
            </div>
          ) : (
            <EmptyState
              title="Document health is admin-only"
              description="Admins can review processing status, failed documents, and approved source coverage."
              icon={FileText}
            />
          )}
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Recent Activity" description="Recent assistant sessions and incident records.">
          <div className="space-y-3">
            {(chatQuery.data ?? []).slice(0, 4).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {session.title || "Safety assistant session"}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {String(session.mode).replace(/_/g, " ")}
                  </p>
                </div>
                <StatusBadge status={session.status} />
              </div>
            ))}
            {!chatQuery.isLoading && !chatQuery.data?.length && (
              <EmptyState
                title="No assistant sessions yet"
                description="Field questions and prevention briefs will appear once teams start using the assistant."
                icon={MessageSquareText}
              />
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Review Queues"
          description="Backend concepts are present; queue summary endpoints are not exposed yet."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <QueuePlaceholder title="Open conflicts" />
            <QueuePlaceholder title="Pending SME reviews" />
            <QueuePlaceholder title="Unsafe feedback" />
            <QueuePlaceholder title="Audit log actions" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const IncidentRow = ({ incident }: { incident: IIncident }) => (
  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-950">
          {incident.title}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
          {incident.root_cause || incident.corrective_action || incident.description || "No summary provided yet."}
        </p>
      </div>
      <StatusBadge status={incident.severity} />
    </div>
    <div className="mt-2 flex flex-wrap gap-2">
      <StatusBadge status={incident.incident_type} />
      <StatusBadge status={incident.status} />
    </div>
  </div>
);

const HealthTile = ({
  label,
  value,
  tone = "blue",
}: {
  label: string;
  value: number;
  tone?: "blue" | "green" | "red";
}) => {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-2 inline-flex rounded-md px-2 py-1 text-lg font-semibold ${styles[tone]}`}>
        {value}
      </p>
    </div>
  );
};

const QueuePlaceholder = ({ title }: { title: string }) => (
  <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3">
    <p className="text-sm font-medium text-slate-800">{title}</p>
    <p className="mt-1 text-xs leading-5 text-slate-500">
      Waiting on an existing API endpoint.
    </p>
  </div>
);

const DashboardListSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="h-20 rounded-md bg-slate-100" />
    ))}
  </div>
);

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.app.root,
  component: AppShellLayout,
  beforeLoad: requireAuth,
});

export const appIndexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: AppDashboard,
});

export const usersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/users",
  component: UsersPage,
  beforeLoad: requireAdmin,
});

export const sitesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/sites",
  component: SitesPage,
  beforeLoad: requireAdmin,
});

export const documentsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/documents",
  component: DocumentsPage,
  beforeLoad: requireAdmin,
});

export const voiceKnowledgeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/voice-knowledge",
  component: VoiceKnowledgePage,
});

export const incidentsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/incidents",
  component: IncidentsPage,
});

export const chatRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/chat",
  component: ChatPage,
});

export const chatSessionRoute = createRoute({
  getParentRoute: () => chatRoute,
  path: "$sessionId",
  component: ChatPage,
});

export const appRoutes = [
  appIndexRoute,
  usersRoute,
  sitesRoute,
  documentsRoute,
  voiceKnowledgeRoute,
  incidentsRoute,
  chatRoute,
] as const;
