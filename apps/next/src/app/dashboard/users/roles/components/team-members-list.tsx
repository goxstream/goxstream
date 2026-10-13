"use client";

import { Mail, Calendar, ShieldCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { TeamMember, RoleDefinition } from "../types";

interface TeamMembersListProps {
  members: TeamMember[];
  roles: RoleDefinition[];
}

export function TeamMembersList({ members, roles }: TeamMembersListProps) {
  const getRoleName = (slug: string) => {
    return roles.find((r) => r.slug === slug)?.name || slug;
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">Internal Staff Team ({members.length})</h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => {
          const initials = m.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

          return (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-xs"
            >
              <Avatar className="size-10 border border-border/60">
                <AvatarImage src={m.avatar} alt={m.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-foreground truncate">{m.name}</span>
                  <Badge variant="outline" className="text-[10px] shrink-0 border-border/60">
                    {getRoleName(m.roleSlug)}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground truncate">{m.email}</span>
                <span className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" /> Joined {new Date(m.joinedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
