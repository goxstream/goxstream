"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import type { NavItem } from "../types";

interface NavSecondaryProps {
  items: NavItem[];
  className?: string;
}

export function NavSecondary({ items, className }: NavSecondaryProps) {
  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel className="text-muted-foreground/70 px-2 py-1.5 text-xs font-semibold tracking-wider uppercase">
        System & Infrastructure
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.isActive}
                className="w-full justify-between"
              >
                <Link href={item.url}>
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="border-border/60 text-muted-foreground ml-auto h-4.5 shrink-0 px-1.5 text-[10px] font-medium group-data-[collapsible=icon]:hidden"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
