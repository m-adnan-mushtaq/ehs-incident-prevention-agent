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
import { TOKEN_PREFIX } from "@/constants/common";
import { ROUTE_PATHS } from "@/routes/paths";
import queryClient from "@/config/query-client";
import { getUserRole, roleLabel } from "@/lib/user-role";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { useAuthStore } from "@/store/auth";
import { LogOut } from "lucide-react";
import { apiInstance } from "@/services/_base";

const NavBar = () => {
  const { user, resetUser } = useAuthStore();
  const { modalState, modalStateHandler } = useModal();
  const role = getUserRole(user);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_PREFIX);
    delete apiInstance.defaults.headers.Authorization;
    resetUser();
    queryClient.clear();
    window.location.href = ROUTE_PATHS.auth.login;
  };

  return (
    <div className="flex w-full items-center justify-between px-4 md:px-8 py-3">
      <div className="hidden lg:block">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Tenant
        </p>
        <p className="text-sm font-medium text-slate-200">
          {user?.tenant?.name ?? "Safety Operations"}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="ml-auto flex cursor-pointer items-center gap-3 rounded-md border border-slate-700/60 bg-slate-900/40 px-3 py-2"
          >
            <UserAvatar user={user} />
            <div className="hidden text-left text-sm sm:block">
              <p className="font-medium text-slate-100">{user?.name}</p>
              <p className="text-xs text-slate-500">
                {role ? roleLabel[role] : "User"}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 border-slate-700 bg-slate-900 text-slate-100">
          <DropdownMenuLabel className="font-normal">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-700" />
          <DropdownMenuItem
            className="cursor-pointer focus:bg-slate-800"
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
