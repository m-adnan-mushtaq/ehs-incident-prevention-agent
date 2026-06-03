import { BadgeCheck, Bell, ChevronDown, LogOut, Search } from "lucide-react";
import {
  CalendarDottedSvg,
  HelpCenterSvg,
  NotificationBellSvg,
} from "@/assets/svgs";
import { commonConstants } from "@/constants";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./user-avatar";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { showMutationError } from "@/helpers/common";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import ConfirmationDialog from "../shared/confirmation-dialog";

const NavBar = () => {
  const { user, resetUser } = useAuthStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.logout,
  });
  const { modalState, modalStateHandler } = useModal();

  const handleLogout = async () => {
    try {
      await mutateAsync();
      localStorage.removeItem(commonConstants.TOKEN_PREFIX);
      resetUser();
    } catch (error) {
      showMutationError(error);
    }
  };

  return (
    <>
      <div className="flex w-full mr-4 justify-between items-center py-4 px-4 md:px-8">
        <div className="flex-1 hidden lg:block">
          <div className="w-full max-w-[400px] border rounded-md relative bg-white">
            <input
              placeholder="Search for anything..."
              type="text"
              className={
                "peer flex h-12 outline-0 w-full bg-white rounded-md border-none  py-4 px-8 text-sm ring-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-lightBlue focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 pl-10 "
              }
            />
            <Search
              className={
                "absolute left-3 text-gray-500 top-1/2 transform -translate-y-1/2 h-[22px] w-[22px] "
              }
            />
          </div>
        </div>
        <div className="flex-1 justify-end  flex item-center gap-4">
          <button className="cursor-pointer hidden sm:block">
            <CalendarDottedSvg fillPath={commonConstants.SVG_SECONDARY} />
          </button>
          <button className="cursor-pointer">
            <HelpCenterSvg fillPath={commonConstants.SVG_SECONDARY} />
          </button>
          <button className="cursor-pointer">
            <NotificationBellSvg fillPath={commonConstants.SVG_SECONDARY} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer relative min-w-fit flex items-center gap-4">
                <UserAvatar user={user || ({} as any)} />
                <span className="bottom-0 left-[36px] absolute  w-3.5 h-3.5 bg-green-600 border-2 border-white dark:border-gray-800 rounded-full"></span>
                <div className="grid flex-1 min-w-fit text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.first_name}
                  </span>
                  <span className="truncate text-xs">
                    {user?.admin ? "Admin" : "Employee"}
                  </span>
                </div>
                <ChevronDown className="text-muted-foreground self-end" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-4">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {`${user?.first_name} ${user?.last_name}`}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/dashboard/profile">
                    <BadgeCheck />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="#">
                    <Bell />
                    Notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  modalStateHandler(MODAL_TYPE.DELETE, true);
                }}
                className="cursor-pointer"
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ConfirmationDialog
        open={modalState.delete}
        handleClose={() => {
          modalStateHandler(MODAL_TYPE.DELETE, false);
        }}
        handleDelete={handleLogout}
        title="Are you sure? You will be logged out."
        deleteBtnText="Logout"
        deleteVariant={"default"}
        loading={isPending}
      />
    </>
  );
};

export default NavBar;
