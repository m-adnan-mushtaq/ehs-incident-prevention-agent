import { cn } from "@/lib/utils"; // Utility function to merge styles
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface Tab {
  label: string | React.ReactNode;
  value: string;
}

interface GenericTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  listClassName?: string; // Custom class for tab list
  tabTriggerClassName?: string; // Custom class for tab triggers
}

export const GenericTabs = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  tabTriggerClassName,
  listClassName,
}: GenericTabsProps) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className={cn("w-full", className)}
    >
      <TabsList className={cn("grid grid-cols-2 h-12 w-full", listClassName)}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn("py-0 h-full px-1 sm:px-4", tabTriggerClassName)}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
