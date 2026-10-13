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
      <h3 className="text-foreground text-sm font-semibold">
        Internal Staff Team ({members.length})
      </h3>

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
              className="border-border/60 bg-card flex items-center gap-3 rounded-lg border p-3 shadow-xs"
            >
              <Avatar className="border-border/60 size-10 border">
                <AvatarImage src={m.avatar} alt={m.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-foreground truncate text-xs font-semibold">{m.name}</span>
                  <Badge variant="outline" className="border-border/60 shrink-0 text-[10px]">
                    {getRoleName(m.roleSlug)}
                  </Badge>
                </div>
                <span className="text-muted-foreground truncate text-[11px]">{m.email}</span>
                <span className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
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
