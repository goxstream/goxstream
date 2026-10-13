"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Shield,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full cursor-pointer"
            >
              <Avatar className="border-border/60 h-8 w-8 rounded-lg border">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-brand/10 text-brand rounded-lg text-xs font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="flex items-center gap-1 truncate font-semibold">
                  {user.name}
                  <Shield className="text-brand fill-brand/20 size-3 shrink-0" />
                </span>
                <span className="text-muted-foreground truncate text-[10px]">{user.email}</span>
              </div>
              <ChevronsUpDown className="text-muted-foreground ml-auto size-4 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border-border/60 w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-xs">
                  <Avatar className="border-border/60 h-8 w-8 rounded-lg border">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-brand/10 text-brand rounded-lg text-xs font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="text-muted-foreground truncate text-[10px]">
                      {user.role} • {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                <Sparkles className="text-brand size-4" />
                <span>Super Admin Mode</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                <BadgeCheck className="text-muted-foreground size-4" />
                <span>Account & Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                <CreditCard className="text-muted-foreground size-4" />
                <span>Subscription & Quota</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                <Bell className="text-muted-foreground size-4" />
                <span>Admin Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2 text-xs"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
