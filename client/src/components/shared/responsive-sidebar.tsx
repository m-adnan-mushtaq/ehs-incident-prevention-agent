import { PropsWithChildren } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

type Props = {
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  side: "left" | "top" | "right" | "bottom";
};
const ResponsiveSidebar = ({
  isMobile,
  isOpen,
  setIsOpen,
  side,
  children,
}: Props & PropsWithChildren) => {
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side={side} className="w-[90vw] max-w-lg p-0">
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return children;
};

export default ResponsiveSidebar;
