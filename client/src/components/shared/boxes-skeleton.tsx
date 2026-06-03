import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust path based on your setup
import { cn } from "@/lib/utils"; // Adjust based on your project's utilities

interface BoxesSkeletonProps {
  count?: number; // Number of skeleton boxes
  size?: string; // Tailwind width (e.g., "w-32")
  layout?: "grid" | "flex" | "stack"; // Layout option
  columns?: string; // Number of columns (only for grid)
}

const BoxesSkeleton: React.FC<BoxesSkeletonProps> = ({
  count = 6,
  size = "w-full h-24",
  layout = "grid",
  columns = "grid-cols-3",
}) => {
  return (
    <div
      className={cn(
        layout === "grid" && `grid  gap-4`,
        layout === "flex" && "flex gap-4 flex-wrap",
        layout === "stack" && "flex flex-col gap-4",
        columns
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={cn(size, "rounded-md")} />
      ))}
    </div>
  );
};

export default BoxesSkeleton;
