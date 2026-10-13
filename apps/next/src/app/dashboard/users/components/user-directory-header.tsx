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
        <h1 className="text-foreground text-2xl font-bold tracking-tight">User Directory</h1>
        <p className="text-muted-foreground text-sm">
          Manage registered audience accounts, membership tiers, and staff credentials.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="border-border/60 h-9 gap-1.5">
          <Download className="size-4" />
          <span>Export CSV</span>
        </Button>
        <Button
          size="sm"
          onClick={onAddUser}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 gap-1.5"
        >
          <UserPlus className="size-4" />
          <span>Add Member</span>
        </Button>
      </div>
    </div>
  );
}
