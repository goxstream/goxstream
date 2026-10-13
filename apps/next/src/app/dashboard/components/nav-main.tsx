"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
      <SidebarGroupLabel className="text-muted-foreground/70 px-2 py-1.5 text-xs font-semibold tracking-wider uppercase">
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
                        variant="secondary"
                        className="bg-brand/10 text-brand border-brand/20 ml-auto h-5 shrink-0 px-1.5 text-[10px] font-medium group-data-[collapsible=icon]:hidden"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible key={item.title} defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.isActive}
                    className="w-full justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </div>
                    <div className="ml-auto flex shrink-0 items-center gap-1 group-data-[collapsible=icon]:hidden">
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="bg-brand/10 text-brand border-brand/20 h-5 px-1.5 text-[10px] font-medium"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="text-muted-foreground size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-border/60 mr-0 border-l pl-2">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild className="w-full justify-between">
                          <Link href={subItem.url}>
                            <span className="truncate">{subItem.title}</span>
                            {subItem.badge && (
                              <Badge
                                variant="outline"
                                className="text-muted-foreground border-border/60 ml-auto h-4 shrink-0 px-1 text-[9px] group-data-[collapsible=icon]:hidden"
                              >
                                {subItem.badge}
                              </Badge>
                            )}
                          </Link>
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
