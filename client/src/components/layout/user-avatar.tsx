import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ICurrentUser } from "@/types/user";

const UserAvatar = ({
  user,
  size = "h-9 w-9",
}: {
  user: ICurrentUser | null;
  size?: string;
}) => {
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar
      className={cn(
        "border border-blue-100 bg-blue-50 text-blue-700",
        size
      )}
    >
      <AvatarImage alt={user?.name} />
      <AvatarFallback className="rounded-full bg-blue-50 text-xs">
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
