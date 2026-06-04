import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import UserAvatar from "@/components/layout/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { performLogout } from "@/lib/logout";
import { getUserRole, roleLabel } from "@/lib/user-role";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { useAuthStore } from "@/store/auth";
import { Building2, LogOut } from "lucide-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

const pageTitles: Record<string, { title: string; label: string }> = {
  "/app": { title: "Safety Operations Dashboard", label: "Command center" },
  "/app/chat": { title: "Safety Assistant", label: "AI guidance" },
  "/app/sites": { title: "Sites", label: "Operational locations" },
  "/app/users": { title: "Field Teams", label: "People and roles" },
  "/app/documents": { title: "Document Library", label: "Approved sources" },
  "/app/incidents": { title: "Incidents", label: "Learning system" },
  "/app/voice-knowledge": {
    title: "Voice Knowledge Notes",
    label: "Expert field knowledge",
  },
};

const NavBar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { modalState, modalStateHandler } = useModal();
  const role = getUserRole(user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current =
    pageTitles[pathname] ??
    (pathname.startsWith("/app/chat")
      ? pageTitles["/app/chat"]
      : pageTitles["/app"]);

  const handleLogout = async () => {
    modalStateHandler(MODAL_TYPE.DELETE, false);
    await performLogout(navigate);
  };

  return (
    <div className="flex w-full items-center justify-between px-4 py-3 md:px-8">
      <div className="hidden min-w-0 lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {current.label}
        </p>
        <p className="truncate text-sm font-semibold text-slate-950">
          {current.title}
        </p>
      </div>
      <div className="ml-auto hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 md:flex">
        <Building2 className="h-4 w-4 text-slate-400" aria-hidden />
        <span className="max-w-48 truncate">
          {user?.tenant?.name ?? "Safety Operations"}
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="ml-3 flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300"
          >
            <UserAvatar user={user} />
            <div className="hidden text-left text-sm sm:block">
              <p className="font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">
                {role ? roleLabel[role] : "User"}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 border-slate-200 bg-white text-slate-900">
          <DropdownMenuLabel className="font-normal">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-200" />
          <DropdownMenuItem
            className="cursor-pointer focus:bg-slate-100"
            onClick={() => modalStateHandler(MODAL_TYPE.DELETE, true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={modalState.delete}
        handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
        handleDelete={handleLogout}
        title="Sign out of Safety Operations?"
        deleteBtnText="Sign out"
        deleteVariant="default"
      />
    </div>
  );
};

export default NavBar;
