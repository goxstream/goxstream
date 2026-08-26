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
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        System & Infrastructure
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={<Link href={item.url} />}
                tooltip={item.title}
                isActive={item.isActive}
              >
                <Icon className="size-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] h-4.5 px-1.5 font-medium border-border/60 text-muted-foreground"
                  >
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
