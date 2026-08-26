"use client";

import { useState } from "react";
import { RolesHeader } from "./components/roles-header";
import { RoleCardsGrid } from "./components/role-cards-grid";
import { PermissionsMatrixTable } from "./components/permissions-matrix-table";
import { TeamMembersList } from "./components/team-members-list";
import { MOCK_ROLES, PERMISSION_ITEMS, MOCK_TEAM_MEMBERS } from "./constants";
import type { RoleDefinition } from "./types";

export default function RolesAndAccessPage() {
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLES);
  const [selectedRoleSlug, setSelectedRoleSlug] = useState<string>("super_admin");

  const handleTogglePermission = (roleSlug: string, permKey: string) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.slug === roleSlug) {
          const hasPerm = role.permissions.includes(permKey);
          const nextPerms = hasPerm
            ? role.permissions.filter((k) => k !== permKey)
            : [...role.permissions, permKey];

          return { ...role, permissions: nextPerms };
        }
        return role;
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <RolesHeader />
      <RoleCardsGrid
        roles={roles}
        selectedRoleSlug={selectedRoleSlug}
        onSelectRole={setSelectedRoleSlug}
      />
      <PermissionsMatrixTable
        roles={roles}
        permissions={PERMISSION_ITEMS}
        selectedRoleSlug={selectedRoleSlug}
        onTogglePermission={handleTogglePermission}
      />
      <TeamMembersList members={MOCK_TEAM_MEMBERS} roles={roles} />
    </div>
  );
}
