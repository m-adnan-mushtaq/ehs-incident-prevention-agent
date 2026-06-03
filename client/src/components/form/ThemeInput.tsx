import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: any;
  startIconProps?: any;
  endIcon?: any;
  endIconProps?: any;
}

const ThemeInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      startIconProps = {},
      endIconProps = {},
      ...props
    },
    ref
  ) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="w-full relative">
        <input
          type={type}
          className={cn(
            "peer flex h-10 w-full font-light rounded-xl border border-secondaryBlue  bg-lightBlue py-2 px-8 text-sm ring-offset-lightPurple file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ring-primary/20",
            startIcon ? "pl-10" : "",
            endIcon ? "pr-10" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {StartIcon && (
          <StartIcon
            {...startIconProps}
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-primary/80 peer-focus:text-primary",
              startIconProps.className
            )}
          />
        )}
        {EndIcon && (
          <EndIcon
            {...endIconProps}
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-primary/50 peer-focus:text-primary/80",
              endIconProps.className || ""
            )}
          />
        )}
      </div>
    );
  }
);
ThemeInput.displayName = "ThemeInput";

export { ThemeInput };
