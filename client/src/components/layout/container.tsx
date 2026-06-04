import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

const Container = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => {
  return (
    <div
      className={cn(
        "max-h-full max-w-full space-y-5 overflow-auto px-4 py-5 md:px-8 md:py-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
