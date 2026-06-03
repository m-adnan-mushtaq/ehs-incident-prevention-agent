import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import SelmtNavLogo from "./layout/logo";
import { INavLink } from "@/types";
import {
  DashboardSvg,
  DecisionSvg,
  GovernanceSvg,
  NotesSvg,
  QuestionSvg,
  RequestSvg,
  RolesSvg,
  SettingSvg,
} from "@/assets/svgs";

const navLinks: INavLink[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: DashboardSvg,
  },
  {
    title: "Governance Management",
    url: "#",
    icon: GovernanceSvg,
    items: [
      {
        title: "Third Party Governance",
        url: "/dashboard/governance",
      },
    ],
  },
  {
    title: "Decision Governance",
    url: "#",
    icon: DecisionSvg,
  },
  {
    title: "Questioner builder",
    url: "/dashboard/questionnaire",
    icon: QuestionSvg,
    badge: "new",
    badgeClasses: "bg-success",
  },
  {
    title: "Request Management",
    url: "#",
    icon: RequestSvg,
  },
  {
    title: "Task Management",
    url: "/dashboard/tasks",
    icon: NotesSvg,
  },
  {
    title: "Users Management",
    url: "#",
    icon: RolesSvg,
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
      },
      {
        title: "Roles",
        url: "/dashboard/roles",
      },
      {
        title: "Role Types",
        url: "/dashboard/role-types",
      },
      {
        title: "User Identity",
        url: "/dashboard/user-identity",
      },
    ],
  },
];

const profileLinks: INavLink[] = [
  {
    title: "My Profile",
    url: "/dashboard/profile",
    icon: SettingSvg,
    badge: "16+",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-white" collapsible="icon" {...props}>
      <SidebarHeader className="bg-white">
        <SelmtNavLogo />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain showLabel items={navLinks} />
        <div className="mt-8">
          <NavMain items={profileLinks} />
        </div>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
