"use client";

import { ChevronDown, Plus } from "lucide-react";

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
import { NavLink, useLocation } from "react-router";
import { INavLink } from "@/types";
import { cn } from "@/lib/utils";
import { isLinkActive } from "@/helpers/common";
import { Badge } from "./ui/badge";

export function NavMain({
  items,
  showLabel,
}: {
  items: INavLink[];
  showLabel?: boolean;
}) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      {showLabel && (
        <SidebarGroupLabel className="capitalize  cursor-pointer text-muted-foreground flex justify-between items-center">
          <span className="uppercase">Pages</span>
          <Plus />
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isLinkActive(pathname, item.url);
          const hasChildren = Boolean(item.items?.length);
          const isActiveChild = hasChildren
            ? item.items?.some((subItem) => subItem.url === pathname)
            : false;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {hasChildren ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          `flex items-center gap-2   text-sm px-2 py-6  rounded-md`,
                          "hover:bg-gray-100 text-gray-800",
                          isActive || isActiveChild
                            ? "!bg-primary !hover:bg-primary !text-white"
                            : "hover:bg-gray-100 text-gray-800"
                        )}
                        tooltip={item.title}
                      >
                        <div className="flex w-full items-center gap-2">
                          {item.icon && (
                            <item.icon
                              fillPath={
                                isActive || isActiveChild ? "#ffff" : "#3B424A"
                              }
                            />
                          )}
                          <span className="min-w-max flex-1">{item.title}</span>
                          <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                className={cn({
                                  "!bg-primary !hover:bg-primary !text-white":
                                    pathname === subItem.url,
                                })}
                                to={subItem.url}
                              >
                                <span>{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <NavLink
                        to={item.url}
                        className={cn(
                          `flex items-center gap-2   text-sm px-2 py-6  rounded-md`,
                          "hover:bg-gray-100 text-gray-800",
                          pathname === item.url
                            ? "!bg-primary !hover:bg-primary !text-white"
                            : "hover:bg-gray-100 text-gray-800"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon && (
                            <item.icon
                              fillPath={isActive ? "#ffff" : "#3B424A"}
                            />
                          )}

                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge
                              className={cn(
                                "ml-auto  rounded-full",
                                item.badgeClasses
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
