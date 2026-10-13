"use client";

import { ShieldPlus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RolesHeaderProps {
  onOpenCreateRole: () => void;
  onOpenInviteStaff: () => void;
}

export function RolesHeader({ onOpenCreateRole, onOpenInviteStaff }: RolesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Roles & Access Control
        </h1>
        <p className="text-muted-foreground text-sm">
          Configure Role-Based Access Control (RBAC) permissions and manage internal staff team
          privileges.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCreateRole}
          className="border-border/60 h-9 gap-1.5 text-xs"
        >
          <ShieldPlus className="size-4" />
          <span>Create Custom Role</span>
        </Button>
        <Button
          size="sm"
          onClick={onOpenInviteStaff}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 gap-1.5 text-xs"
        >
          <UserPlus className="size-4" />
          <span>Invite Staff</span>
        </Button>
      </div>
    </div>
  );
}
