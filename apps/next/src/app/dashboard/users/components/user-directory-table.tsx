"use client";

import { MoreHorizontal, Eye, ShieldAlert, KeyRound, Crown, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserAccount } from "../types";

interface UserDirectoryTableProps {
  users: UserAccount[];
  onSelectUser: (user: UserAccount) => void;
  onEditUser: (user: UserAccount) => void;
  onToggleStatus: (userId: string) => void;
}

export function UserDirectoryTable({
  users,
  onSelectUser,
  onEditUser,
  onToggleStatus,
}: UserDirectoryTableProps) {
  const getRoleBadge = (role: UserAccount["role"]) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge variant="secondary" className="border-border/60 bg-muted/60 text-xs">
            Super Admin
          </Badge>
        );
      case "admin":
        return (
          <Badge variant="secondary" className="border-border/60 text-xs">
            Admin
          </Badge>
        );
      case "content_manager":
        return (
          <Badge variant="outline" className="border-border/60 text-xs">
            Content Manager
          </Badge>
        );
      case "moderator":
        return (
          <Badge variant="outline" className="border-border/60 text-xs">
            Moderator
          </Badge>
        );
      default:
        return <span className="text-muted-foreground text-xs">Viewer</span>;
    }
  };

  const getStatusBadge = (status: UserAccount["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="text-foreground inline-flex items-center gap-1.5 text-xs font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case "suspended":
        return (
          <span className="text-destructive inline-flex items-center gap-1.5 text-xs font-medium">
            <span className="bg-destructive size-1.5 rounded-full" />
            Suspended
          </span>
        );
      case "pending":
        return (
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs font-medium">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
    }
  };

  if (users.length === 0) {
    return (
      <div className="border-border/60 bg-card flex flex-col items-center justify-center rounded-lg border p-12 text-center shadow-xs">
        <p className="text-foreground text-sm font-medium">No users found</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Try adjusting your search terms or active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/60 bg-card overflow-hidden rounded-lg border shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-foreground text-xs font-semibold">User / Audience</TableHead>
            <TableHead className="text-foreground text-xs font-semibold">Role</TableHead>
            <TableHead className="text-foreground text-xs font-semibold">Tier</TableHead>
            <TableHead className="text-foreground text-xs font-semibold">Status</TableHead>
            <TableHead className="text-foreground text-xs font-semibold">Last Active</TableHead>
            <TableHead className="text-foreground w-[60px] text-right text-xs font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const initials = user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            return (
              <TableRow key={user.id} className="border-border/60 hover:bg-muted/20">
                {/* User column */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="border-border/60 size-9 border">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-foreground text-xs font-semibold">{user.name}</span>
                      <span className="text-muted-foreground text-[11px]">
                        @{user.username} • {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Role column */}
                <TableCell className="py-3">{getRoleBadge(user.role)}</TableCell>

                {/* Tier column */}
                <TableCell className="py-3">
                  {user.membershipTier === "vip_pro" ? (
                    <Badge
                      variant="outline"
                      className="gap-1 border-amber-500/30 bg-amber-500/10 text-[10px] font-medium text-amber-500"
                    >
                      <Crown className="size-3" />
                      <span>VIP Pro</span>
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">Free Tier</span>
                  )}
                </TableCell>

                {/* Status column */}
                <TableCell className="py-3">{getStatusBadge(user.status)}</TableCell>

                {/* Last active column */}
                <TableCell className="text-muted-foreground py-3 text-xs">
                  {new Date(user.lastActiveAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>

                {/* Actions column */}
                <TableCell className="py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel className="text-muted-foreground text-[11px] font-normal">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-xs"
                        onClick={() => onSelectUser(user)}
                      >
                        <Eye className="size-3.5" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-xs"
                        onClick={() => onEditUser(user)}
                      >
                        <Edit className="size-3.5" />
                        <span>Edit Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-xs"
                        onClick={() => alert(`Reset password email sent to ${user.email}`)}
                      >
                        <KeyRound className="size-3.5" />
                        <span>Reset Password</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer gap-2 text-xs"
                        onClick={() => onToggleStatus(user.id)}
                      >
                        <ShieldAlert className="size-3.5" />
                        <span>
                          {user.status === "suspended" ? "Unsuspend Account" : "Suspend Account"}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
