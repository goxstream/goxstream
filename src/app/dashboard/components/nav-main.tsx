"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import type { NavItem } from "../types";

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 py-1.5">
        Management & Studio
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          const hasSubItems = Boolean(item.items && item.items.length > 0);

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  tooltip={item.title}
                  isActive={item.isActive}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px] h-5 px-1.5 font-medium bg-brand/10 text-brand border-brand/20 shrink-0 group-data-[collapsible=icon]:hidden"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={item.isActive}
                      className="w-full justify-between"
                    />
                  }
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto shrink-0 group-data-[collapsible=icon]:hidden">
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-5 px-1.5 font-medium bg-brand/10 text-brand border-brand/20"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="mr-0 border-l border-border/60 pl-2">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          render={<Link href={subItem.url} />}
                          className="w-full justify-between"
                        >
                          <span className="truncate">{subItem.title}</span>
                          {subItem.badge && (
                            <Badge
                              variant="outline"
                              className="ml-auto text-[9px] h-4 px-1 text-muted-foreground border-border/60 shrink-0 group-data-[collapsible=icon]:hidden"
                            >
                              {subItem.badge}
                            </Badge>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
