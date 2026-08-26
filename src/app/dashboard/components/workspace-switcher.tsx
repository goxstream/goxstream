"use client";

import * as React from "react";
import { ChevronsUpDown, Check, Plus, Server, HardDrive, ShieldCheck } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogoBrand } from "@/components/logo-brand";
import { Logo } from "@/components/logo";
import type { WorkspaceItem } from "../types";

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceItem[];
}

export function WorkspaceSwitcher({ workspaces }: WorkspaceSwitcherProps) {
  const { isMobile, state } = useSidebar();
  const [activeWorkspace, setActiveWorkspace] = React.useState<WorkspaceItem>(
    workspaces[0] ?? {
      id: "prod",
      name: "GoxStream Production",
      plan: "Enterprise",
      role: "Owner",
    }
  );

  const getWorkspaceIcon = (id: string) => {
    switch (id) {
      case "staging":
        return <HardDrive className="size-4 text-emerald-400 shrink-0" />;
      case "cdn":
        return <ShieldCheck className="size-4 text-emerald-400 shrink-0" />;
      default:
        return <Server className="size-4 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group cursor-pointer w-full"
              />
            }
          >
            {state === "collapsed" ? (
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary transition-transform group-hover:scale-105">
                <Logo size={22} />
              </div>
            ) : (
              <div className="flex items-center justify-between w-full min-w-0 pr-0.5">
                <LogoBrand variant="horizontal" size="sm" className="px-0 py-0" />
                <ChevronsUpDown className="size-4 text-muted-foreground shrink-0 ml-auto" />
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-border/60"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-medium">
                Environments & Nodes
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => setActiveWorkspace(workspace)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border border-border/60 bg-background">
                  {getWorkspaceIcon(workspace.id)}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold leading-tight truncate">
                    {workspace.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {workspace.role} • {workspace.plan}
                  </span>
                </div>
                {activeWorkspace.id === workspace.id && (
                  <Check className="size-4 text-brand ml-auto shrink-0" />
                )}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2 cursor-pointer text-muted-foreground">
              <div className="flex size-6 items-center justify-center rounded-md border border-dashed border-border/80 bg-background">
                <Plus className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-foreground">Add New Node / Env</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
