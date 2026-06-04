import { cn } from "@/lib/utils";

type MaterialIconProps = {
  name: string;
  filled?: boolean;
  className?: string;
  "aria-hidden"?: boolean;
};

export const MaterialIcon = ({
  name,
  filled = false,
  className,
  "aria-hidden": ariaHidden = true,
}: MaterialIconProps) => (
  <span
    className={cn("material-symbols-outlined leading-none", className)}
    style={
      filled
        ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
        : undefined
    }
    aria-hidden={ariaHidden}
  >
    {name}
  </span>
);
