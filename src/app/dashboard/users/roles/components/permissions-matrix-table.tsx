"use client";

import { Check, Minus, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { RoleDefinition, PermissionItem } from "../types";

interface PermissionsMatrixTableProps {
  roles: RoleDefinition[];
  permissions: PermissionItem[];
  selectedRoleSlug: string;
  onTogglePermission: (roleSlug: string, permKey: string) => void;
}

export function PermissionsMatrixTable({
  roles,
  permissions,
  selectedRoleSlug,
  onTogglePermission,
}: PermissionsMatrixTableProps) {
  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Granular Permission Matrix</h3>
        <span className="text-xs text-muted-foreground">
          Click checkmark to toggle permissions for active role.
        </span>
      </div>

      <div className="rounded-lg border border-border/60 bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[300px] text-xs font-semibold text-foreground">Permission Capability</TableHead>
              {roles.map((r) => (
                <TableHead
                  key={r.id}
                  className={`text-center text-xs font-semibold ${
                    r.slug === selectedRoleSlug ? "text-primary font-bold bg-primary/5" : "text-foreground"
                  }`}
                >
                  {r.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => {
              const catPerms = permissions.filter((p) => p.category === cat);

              return (
                <React.Fragment key={cat}>
                  <TableRow className="bg-muted/40 border-border/60 hover:bg-muted/40">
                    <TableCell colSpan={roles.length + 1} className="py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Category: {cat}
                    </TableCell>
                  </TableRow>

                  {catPerms.map((perm) => (
                    <TableRow key={perm.id} className="border-border/60 hover:bg-muted/20">
                      {/* Permission info */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-foreground">{perm.name}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="size-3.5 text-muted-foreground cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs max-w-xs">
                                {perm.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono">{perm.key}</span>
                      </TableCell>

                      {/* Role checkboxes */}
                      {roles.map((r) => {
                        const hasPerm = r.permissions.includes(perm.key);
                        const isSelectedRole = r.slug === selectedRoleSlug;

                        return (
                          <TableCell
                            key={r.id}
                            className={`py-3 text-center ${isSelectedRole ? "bg-primary/5" : ""}`}
                          >
                            <button
                              type="button"
                              onClick={() => onTogglePermission(r.slug, perm.key)}
                              className={`inline-flex size-6 items-center justify-center rounded border transition-colors ${
                                hasPerm
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border/60 bg-muted/20 text-muted-foreground hover:border-foreground/40"
                              }`}
                            >
                              {hasPerm ? <Check className="size-3.5" /> : <Minus className="size-3.5 opacity-40" />}
                            </button>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import React from "react";
