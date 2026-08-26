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
import { WORKSPACES_DATA } from "../lib/mock-data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [currentUser, setCurrentUser] = React.useState({
    name: "Alex Rivera",
    email: "alex@goxstream.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Super Admin",
  });

  React.useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = (await res.json()) as { user?: any };
          if (isMounted && data.user) {
            setCurrentUser({
              name: data.user.displayName,
              email: data.user.email,
              avatar: data.user.avatarUrl,
              role: data.user.role === "admin" ? "Super Admin" : "Content Moderator",
            });
          }
        }
      } catch {
        // Fallback
      }
    }
    fetchMe();
    return () => {
      isMounted = false;
    };
  }, []);

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
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
