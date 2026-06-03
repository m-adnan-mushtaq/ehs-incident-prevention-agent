import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { INavLink } from "@/types";
import { Link, useRouterState } from "@tanstack/react-router";

export const NavMain = ({
  items,
  showLabel,
}: {
  items: INavLink[];
  showLabel?: boolean;
}) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarGroup>
      {showLabel && (
        <SidebarGroupLabel className="text-xs uppercase tracking-wide text-slate-500">
          Modules
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          const hasChildren = Boolean(item.items?.length);
          const isActiveChild = item.items?.some((sub) => pathname === sub.url);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActiveChild}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {hasChildren ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                          (isActive || isActiveChild) &&
                            "bg-blue-50 text-blue-700"
                        )}
                        tooltip={item.title}
                      >
                        <div className="flex w-full items-center gap-2">
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span className="flex-1">{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                to={subItem.url}
                                className={cn(
                                  pathname === subItem.url &&
                                    "bg-blue-50 text-blue-700"
                                )}
                              >
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                        isActive && "bg-blue-50 text-blue-700"
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
