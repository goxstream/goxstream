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
        <h3 className="text-foreground text-sm font-semibold">Granular Permission Matrix</h3>
        <span className="text-muted-foreground text-xs">
          Click checkmark to toggle permissions for active role.
        </span>
      </div>

      <div className="border-border/60 bg-card overflow-hidden rounded-lg border shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-foreground w-[300px] text-xs font-semibold">
                Permission Capability
              </TableHead>
              {roles.map((r) => (
                <TableHead
                  key={r.id}
                  className={`text-center text-xs font-semibold ${
                    r.slug === selectedRoleSlug
                      ? "text-primary bg-primary/5 font-bold"
                      : "text-foreground"
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
                    <TableCell
                      colSpan={roles.length + 1}
                      className="text-muted-foreground py-2 text-[11px] font-bold tracking-wider uppercase"
                    >
                      Category: {cat}
                    </TableCell>
                  </TableRow>

                  {catPerms.map((perm) => (
                    <TableRow key={perm.id} className="border-border/60 hover:bg-muted/20">
                      {/* Permission info */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground text-xs font-semibold">{perm.name}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="text-muted-foreground size-3.5 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-xs">
                                {perm.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {perm.key}
                        </span>
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
                              {hasPerm ? (
                                <Check className="size-3.5" />
                              ) : (
                                <Minus className="size-3.5 opacity-40" />
                              )}
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
