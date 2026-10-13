"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { NAV_MAIN_DATA, NAV_SECONDARY_DATA } from "../constants";
import { useSidebarUser } from "../hooks/use-sidebar-user";
import { Logo } from "@/components/logo";
import { LogoBrand } from "@/components/logo-brand";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentUser } = useSidebarUser();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60" {...props}>
      <SidebarHeader className="border-b border-border/60 p-2.5">
        {state === "collapsed" ? (
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary transition-transform group-hover:scale-105 mx-auto">
            <Logo size={22} />
          </div>
        ) : (
          <LogoBrand variant="horizontal" size="sm" className="px-1.5 py-1" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_MAIN_DATA} />
        <NavSecondary items={NAV_SECONDARY_DATA} className="mt-auto border-t border-border/60" />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/60 p-2">
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
