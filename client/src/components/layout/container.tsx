import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

const Container = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => {
  return (
    <div
      className={cn(
        "my-4  px-4 md:px-8 max-w-full space-y-4 md:my-14 max-h-full overflow-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
