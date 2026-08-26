"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Film,
  PlaySquare,
  Users,
  BarChart3,
  Settings,
  ShieldAlert,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import type { WorkspaceItem, NavItem } from "../types";

const WORKSPACES_DATA: WorkspaceItem[] = [
  {
    id: "prod",
    name: "GoxStream Production",
    plan: "Enterprise",
    role: "Owner",
  },
  {
    id: "staging",
    name: "Staging Edge Cluster",
    plan: "Developer",
    role: "Admin",
  },
  {
    id: "cdn",
    name: "Global CDN Hub",
    plan: "Infrastructure",
    role: "Maintainer",
  },
];

const NAV_MAIN_DATA: NavItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Anime Catalog",
    url: "/dashboard/anime",
    icon: Film,
    badge: "1,248",
    items: [
      { title: "All Anime List", url: "/dashboard/anime" },
      { title: "Add New Anime", url: "/dashboard/anime/new", badge: "New" },
      { title: "Categories & Genres", url: "/dashboard/anime/categories" },
      { title: "Season Schedule", url: "/dashboard/anime/seasons" },
    ],
  },
  {
    title: "Episode Studio",
    url: "/dashboard/episodes",
    icon: PlaySquare,
    badge: "8,920",
    items: [
      { title: "Episode Manager", url: "/dashboard/episodes" },
      { title: "Add Episode", url: "/dashboard/episodes/new" },
      { title: "Video Server Sources", url: "/dashboard/episodes/servers" },
      { title: "Subtitles & Audio", url: "/dashboard/episodes/subtitles" },
    ],
  },
  {
    title: "User Management",
    url: "/dashboard/users",
    icon: Users,
    badge: "45k",
    items: [
      { title: "User Directory", url: "/dashboard/users" },
      { title: "Moderation Queue", url: "/dashboard/users/moderation", badge: "12" },
      { title: "Roles & Access", url: "/dashboard/users/roles" },
    ],
  },
];

const NAV_SECONDARY_DATA: NavItem[] = [
  {
    title: "Analytics & CDN",
    url: "/dashboard/analytics",
    icon: BarChart3,
    badge: "Live",
  },
  {
    title: "Platform Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Security Logs",
    url: "/dashboard/logs",
    icon: ShieldAlert,
    badge: "Audit",
  },
];

const CURRENT_USER = {
  name: "Alexander Vance",
  email: "alexander@goxstream.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  role: "Lead Administrator",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/60" {...props}>
      <SidebarHeader className="border-b border-border/60 p-2">
        <WorkspaceSwitcher workspaces={WORKSPACES_DATA} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_MAIN_DATA} />
        <NavSecondary items={NAV_SECONDARY_DATA} className="mt-auto border-t border-border/60" />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/60 p-2">
        <NavUser user={CURRENT_USER} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
