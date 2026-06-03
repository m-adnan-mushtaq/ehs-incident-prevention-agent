import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getUserAvatar } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { IUser } from "@/services/auth.service";
import { AvatarFallback } from "@radix-ui/react-avatar";

const UserAvatar = ({
  user,
  size = "h-12 w-12",
}: {
  user: IUser;
  size?: string;
}) => {
  return (
    <Avatar
      className={cn(
        "h-12 w-12 text-sm text-center border border-primary bg-gray-50 flex items-center justify-center rounded-full",
        size
      )}
    >
      <AvatarImage
        className="object-contain w-full h-full rounded-full "
        src={getUserAvatar(user?.profile_photo)}
        alt={user?.first_name}
      />
      <AvatarFallback className="rounded-lg">
        {user?.first_name?.charAt(0)} {user?.last_name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
