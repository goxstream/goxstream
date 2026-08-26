"use client";

import { ShieldPlus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RolesHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Roles & Access Control</h1>
        <p className="text-sm text-muted-foreground">
          Configure Role-Based Access Control (RBAC) permissions and manage internal staff team privileges.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9 gap-1.5 border-border/60 text-xs">
          <ShieldPlus className="size-4" />
          <span>Create Custom Role</span>
        </Button>
        <Button size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
          <UserPlus className="size-4" />
          <span>Invite Staff</span>
        </Button>
      </div>
    </div>
  );
}
