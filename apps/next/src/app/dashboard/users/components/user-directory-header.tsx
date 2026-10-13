"use client";

import { UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserDirectoryHeaderProps {
  onAddUser: () => void;
}

export function UserDirectoryHeader({ onAddUser }: UserDirectoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">User Directory</h1>
        <p className="text-sm text-muted-foreground">
          Manage registered audience accounts, membership tiers, and staff credentials.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9 gap-1.5 border-border/60">
          <Download className="size-4" />
          <span>Export CSV</span>
        </Button>
        <Button size="sm" onClick={onAddUser} className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
          <UserPlus className="size-4" />
          <span>Add Member</span>
        </Button>
      </div>
    </div>
  );
}
