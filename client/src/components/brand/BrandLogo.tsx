import { MaterialIcon } from "@/components/brand/MaterialIcon";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type BrandLogoProps = {
  to?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  variant?: "default" | "inverse";
  className?: string;
};

const sizeStyles = {
  sm: {
    icon: "text-2xl",
    title: "text-base",
    tagline: "text-[9px]",
  },
  md: {
    icon: "text-3xl",
    title: "text-xl",
    tagline: "text-[10px]",
  },
  lg: {
    icon: "text-3xl",
    title: "text-lg",
    tagline: "text-[10px]",
  },
};

export const BrandLogo = ({
  to,
  size = "md",
  showTagline = true,
  variant = "default",
  className,
}: BrandLogoProps) => {
  const styles = sizeStyles[size];
  const isInverse = variant === "inverse";
  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <MaterialIcon
        name="shield_person"
        filled
        className={cn(
          isInverse ? "text-blue-300" : "text-safety-brand",
          styles.icon
        )}
      />
      <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
        <span
          className={cn(
            "font-bold",
            isInverse ? "text-white" : "text-safety-ink",
            styles.title
          )}
        >
          Safety Operations AI
        </span>
        {showTagline && (
          <span
            className={cn(
              "font-bold uppercase tracking-widest",
              isInverse ? "text-blue-200/70" : "text-safety-outline-strong",
              styles.tagline
            )}
          >
            EHS Incident Prevention
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
};
