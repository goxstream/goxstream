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
    <Sidebar collapsible="icon" className="border-border/60 border-r" {...props}>
      <SidebarHeader className="border-border/60 border-b p-2.5">
        {state === "collapsed" ? (
          <div className="bg-sidebar-primary/10 text-sidebar-primary mx-auto flex aspect-square size-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
            <Logo size={22} />
          </div>
        ) : (
          <LogoBrand variant="horizontal" size="sm" className="px-1.5 py-1" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_MAIN_DATA} />
        <NavSecondary items={NAV_SECONDARY_DATA} className="border-border/60 mt-auto border-t" />
      </SidebarContent>
      <SidebarFooter className="border-border/60 border-t p-2">
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
