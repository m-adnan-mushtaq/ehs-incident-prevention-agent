"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User, Lock, BadgeCheck } from "lucide-react";

interface ProfileSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  {
    id: "account",
    label: "Account Information",
    icon: <BadgeCheck className="h-4 w-4" />,
  },
  {
    id: "personal",
    label: "Personal Information",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "password",
    label: "Password & Security",
    icon: <Lock className="h-4 w-4" />,
  },
];

const ProfileSidebar = ({
  activeSection,
  setActiveSection,
  isMobile,
  isOpen,
  setIsOpen,
}: ProfileSidebarProps) => {
  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Profile Settings</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className="w-full justify-start gap-3"
            onClick={() => handleNavClick(item.id)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-64 shrink-0 border-r bg-background">
      <SidebarContent />
    </div>
  );
};

export default ProfileSidebar;
