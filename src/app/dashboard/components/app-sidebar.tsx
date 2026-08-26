"use client";

import * as React from "react";
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
import { NAV_MAIN_DATA, NAV_SECONDARY_DATA } from "../constants";
import { WORKSPACES_DATA, CURRENT_USER } from "../lib/mock-data";

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
